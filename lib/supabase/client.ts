
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { StrategicFundamentals, SwotType, Perspective, StrategicObjective, ObjectiveRelationship, Indicator, Project } from '../../types';

// --- CONFIGURAÇÃO ---
// Usando import.meta.env para Vite.
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

// Verifica se estamos usando valores reais ou placeholders
const isMockMode = !envUrl || envUrl === 'your_supabase_url' || envUrl.includes('xyz.supabase.co');

const supabaseUrl = envUrl || 'https://xyz.supabase.co';
const supabaseAnonKey = envKey || 'public-anon-key';

// Funções para persistência em localStorage
const loadMockData = () => {
  try {
    const stored = localStorage.getItem('sgem_mock_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Erro ao carregar dados mockados:', e);
  }
  return null;
};

const saveMockData = () => {
  try {
    localStorage.setItem('sgem_mock_data', JSON.stringify({
      bsc: MOCK_BSC,
      projects: MOCK_PROJECTS,
      db: MOCK_DB
    }));
  } catch (e) {
    console.warn('Erro ao salvar dados mockados:', e);
  }
};

// --- MOCK AUTH CLIENT ---
// Implementação simulada do Supabase Auth para permitir testar o frontend sem backend configurado
class MockAuthClient {
  private sessionKey = 'sgem-mock-session';

  private getStoredSession(): Session | null {
    const stored = localStorage.getItem(this.sessionKey);
    return stored ? JSON.parse(stored) : null;
  }

  async signInWithPassword({ email, password }: any) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay de rede

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return {
        data: { user: null, session: null },
        error: { message: 'Senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula e 1 número' }
      };
    }

    const user: User = {
      id: 'mock-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: email,
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const session: Session = {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: user,
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    // Dispara evento de mudança de estado
    this.notifySubscribers('SIGNED_IN', session);

    return { data: { user, session }, error: null };
  }

  async signOut() {
    localStorage.removeItem(this.sessionKey);
    this.notifySubscribers('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession() {
    return { data: { session: this.getStoredSession() }, error: null };
  }

  // Sistema simples de pub/sub para onAuthStateChange
  private subscribers: Function[] = [];

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.subscribers.push(callback);
    // Chama imediatamente com o estado atual
    const currentSession = this.getStoredSession();
    callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', currentSession);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
          }
        }
      }
    };
  }

  private notifySubscribers(event: string, session: Session | null) {
    this.subscribers.forEach(cb => cb(event, session));
  }
}

// --- SUPABASE CLIENT FACTORY ---
let supabaseInstance: any;

if (isMockMode) {
  console.warn('⚠️ SGEM: Executando em MODO MOCK (Sem conexão real com Supabase).');
  const mockAuth = new MockAuthClient();
  supabaseInstance = {
    auth: mockAuth,
    // Mock Database
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
    // Mock Storage
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File, options?: any) => {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simula upload
          console.log(`[MOCK STORAGE] Uploaded ${file.name} to bucket '${bucket}' at path '${path}'`);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://mock-storage.com/${path}` }
        })
      })
    }
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;

// --- MOCK API SERVICE (DADOS DE NEGÓCIO) ---
// Mantido para persistir dados em memória durante a sessão
let MOCK_DB: StrategicFundamentals = {
  mission: "Promover a qualidade de vida e o desenvolvimento sustentável do município, através de uma gestão pública eficiente, transparente e participativa.",
  vision: "Ser reconhecida até 2028 como a cidade referência em inovação e bem-estar social no estado.",
  values: ["Transparência", "Ética", "Inovação", "Eficiência", "Sustentabilidade"],
  swotAnalysis: [
    { id: '1', text: 'Equipe técnica qualificada', type: SwotType.STRENGTH, importance: 5, icon: 'Users' },
    { id: '2', text: 'Arrecadação baixa', type: SwotType.WEAKNESS, importance: 4, icon: 'TrendingDown' },
    { id: '3', text: 'Novos editais federais', type: SwotType.OPPORTUNITY, importance: 5, icon: 'FileText' },
    { id: '4', text: 'Mudanças na legislação fiscal', type: SwotType.THREAT, importance: 3, icon: 'Scale' }
  ]
};

// --- BSC MOCK DATA ---
let MOCK_BSC = {
  perspectives: [
    { id: 'p1', name: 'Financeira', description: 'Sustentabilidade Econômica', type: 'FINANCIAL', color: 'bg-blue-500', order: 1 },
    { id: 'p2', name: 'Cidadãos e Sociedade', description: 'Satisfação do Cidadão', type: 'CUSTOMER', color: 'bg-emerald-500', order: 2 },
    { id: 'p3', name: 'Processos Internos', description: 'Excelência Operacional', type: 'PROCESSES', color: 'bg-amber-500', order: 3 },
    { id: 'p4', name: 'Aprendizado e Crescimento', description: 'Capacidade Organizacional', type: 'LEARNING', color: 'bg-purple-500', order: 4 },
  ] as Perspective[],
  objectives: [
    { id: 'o1', code: 'FIN-01', title: 'Aumentar Arrecadação Própria', description: 'Otimizar IPTU e ISS', perspectiveId: 'p1', status: 'ACTIVE', progress: 75 },
    { id: 'o2', code: 'CID-01', title: 'Melhorar Qualidade da Saúde', description: 'Reduzir filas', perspectiveId: 'p2', status: 'ACTIVE', progress: 60 },
    { id: 'o3', code: 'PRO-01', title: 'Digitalizar Serviços', description: 'Implantar Processo Eletrônico', perspectiveId: 'p3', status: 'ACTIVE', progress: 90 },
    { id: 'o4', code: 'APR-01', title: 'Capacitar Servidores', description: 'Treinamento contínuo', perspectiveId: 'p4', status: 'ACTIVE', progress: 40 },
  ] as StrategicObjective[],
  relationships: [
    { id: 'r1', sourceId: 'o3', targetId: 'o2' }, // Digitalizar -> Melhorar Saúde
    { id: 'r2', sourceId: 'o3', targetId: 'o1' }, // Digitalizar -> Aumentar Arrecadação (eficiência)
    { id: 'r3', sourceId: 'o4', targetId: 'o3' }, // Capacitar -> Digitalizar
  ] as ObjectiveRelationship[],
  indicators: [
    { 
      id: 'i1', code: 'IND-01', name: 'Índice de Digitalização', objectiveId: 'o3', 
      unit: '%', frequency: 'MONTHLY', baseline: 20, target: 100, currentValue: 90, polarity: 'HIGHER_BETTER', source: 'TI'
    },
    { 
      id: 'i2', code: 'IND-02', name: 'Tempo Médio de Espera (Saúde)', objectiveId: 'o2', 
      unit: 'Dias', frequency: 'MONTHLY', baseline: 45, target: 15, currentValue: 25, polarity: 'LOWER_BETTER', source: 'Sec. Saúde'
    }
  ] as Indicator[]
};

// --- PROJECTS MOCK DATA (PHASE 3) ---
let MOCK_PROJECTS: Project[] = [
  {
    id: 'proj1',
    code: 'PE-2025-01',
    title: 'Implantação do Prontuário Eletrônico',
    description: 'Digitalização completa dos registros de pacientes na rede municipal.',
    manager: 'Dr. Roberto Silva',
    sponsor: 'Sec. de Saúde',
    status: 'IN_PROGRESS',
    health: 'HEALTHY',
    methodology: 'HYBRID',
    progress: 45,
    startDate: '2025-01-15',
    endDate: '2025-12-20',
    baselineStartDate: '2025-01-15',
    baselineEndDate: '2025-11-30',
    budget: {
      estimated: 500000,
      approved: 480000,
      spent: 210000,
      committed: 300000
    },
    strategicObjectiveId: 'o3', // Link to PRO-01
    cpi: 1.05,
    spi: 0.98
  },
  {
    id: 'proj2',
    code: 'PE-2025-02',
    title: 'Reforma da Escola Central',
    description: 'Ampliação de salas e modernização elétrica.',
    manager: 'Eng. Ana Costa',
    sponsor: 'Sec. de Educação',
    status: 'PAUSED',
    health: 'CRITICAL',
    methodology: 'TRADITIONAL',
    progress: 30,
    startDate: '2025-02-01',
    endDate: '2025-08-30',
    budget: {
      estimated: 800000,
      approved: 800000,
      spent: 400000,
      committed: 400000
    },
    strategicObjectiveId: 'o2',
    cpi: 0.85,
    spi: 0.70
  },
  {
    id: 'proj3',
    code: 'PE-2025-03',
    title: 'Novo Portal do Contribuinte',
    description: 'Sistema web para emissão de guias e certidões.',
    manager: 'Carlos Dev',
    sponsor: 'Sec. de Finanças',
    status: 'COMPLETED',
    health: 'HEALTHY',
    methodology: 'AGILE',
    progress: 100,
    startDate: '2025-01-10',
    endDate: '2025-04-30',
    budget: {
      estimated: 150000,
      approved: 150000,
      spent: 145000,
      committed: 150000
    },
    strategicObjectiveId: 'o1', // Link to FIN-01
    cpi: 1.03,
    spi: 1.0
  }
];

export const fundamentalsApi = {
  get: async (): Promise<StrategicFundamentals> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...MOCK_DB };
  },
  update: async (data: Partial<StrategicFundamentals>): Promise<StrategicFundamentals> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    MOCK_DB = { ...MOCK_DB, ...data };
    return { ...MOCK_DB };
  }
};

export const bscApi = {
  getPerspectives: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_BSC.perspectives;
  },
  getObjectives: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_BSC.objectives;
  },
  getRelationships: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_BSC.relationships;
  },
  getIndicators: async (objectiveId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (objectiveId) return MOCK_BSC.indicators.filter(i => i.objectiveId === objectiveId);
    return MOCK_BSC.indicators;
  },
  createObjective: async (obj: Omit<StrategicObjective, 'id' | 'code' | 'progress'>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const perspective = MOCK_BSC.perspectives.find(p => p.id === obj.perspectiveId);
    const prefix = perspective?.type.substring(0, 3).toUpperCase() || 'OBJ';
    const count = MOCK_BSC.objectives.filter(o => o.perspectiveId === obj.perspectiveId).length + 1;
    
    const newObj: StrategicObjective = {
      id: Math.random().toString(36).substr(2, 9),
      code: `${prefix}-${count.toString().padStart(2, '0')}`,
      progress: 0,
      ...obj
    };
    MOCK_BSC.objectives.push(newObj);
    return newObj;
  },
  createIndicator: async (ind: Omit<Indicator, 'id' | 'code'>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const count = MOCK_BSC.indicators.length + 1;
    const newInd: Indicator = {
      id: Math.random().toString(36).substr(2, 9),
      code: `IND-${count.toString().padStart(2, '0')}`,
      ...ind
    };
    MOCK_BSC.indicators.push(newInd);
    return newInd;
  },
  createMeasurement: async (measurement: Omit<any, 'id'> & { indicatorId: string }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const indicator = MOCK_BSC.indicators.find(i => i.id === measurement.indicatorId);
    if (indicator) {
      const newMeasurement: any = {
        id: Math.random().toString(36).substr(2, 9),
        ...measurement
      };
      if (!indicator.measurements) indicator.measurements = [];
      indicator.measurements.push(newMeasurement);
      indicator.currentValue = newMeasurement.value;
      return newMeasurement;
    }
    throw new Error("Indicador não encontrado");
  },
  createTargets: async (targets: any[], indicatorId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const indicator = MOCK_BSC.indicators.find(i => i.id === indicatorId);
    if (indicator) {
      indicator.targets = targets;
      return targets;
    }
    throw new Error("Indicador não encontrado");
  }
};

export const projectsApi = {
  list: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return MOCK_PROJECTS;
  },
  getById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROJECTS.find(p => p.id === id);
  },
  create: async (project: Partial<Project>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      code: `PE-2025-${(MOCK_PROJECTS.length + 1).toString().padStart(2, '0')}`,
      progress: 0,
      status: 'PLANNING',
      health: 'HEALTHY',
      ...project
    } as Project;
    MOCK_PROJECTS.push(newProject);
    return newProject;
  }
};
