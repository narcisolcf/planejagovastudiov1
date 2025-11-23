/**
 * Camada de Abstração de Storage
 *
 * Arquitetura:
 * - Supabase Storage: Principal (arquivos de usuários, documentos legais, evidências)
 * - GCP Cloud Storage: Processamento e backup (opcional)
 */

import { supabase } from '../supabase/client';

// ========================================
// TYPES
// ========================================

export type LegalDocumentType = 'PPA' | 'LDO' | 'LOA';

export interface UploadResult {
  path: string;
  url: string;
  size?: number;
}

export interface IndicatorEvidenceUpload {
  indicatorCode: string;
  year: number;
  month: string;
  file: File;
}

// ========================================
// SUPABASE STORAGE (Principal)
// ========================================

export const supabaseStorage = {
  /**
   * Upload de documentos legais (PPA, LDO, LOA)
   * Bucket: 'documents'
   * Path: docs_legais/TIPO_TIMESTAMP.pdf
   */
  uploadLegalDocument: async (
    type: LegalDocumentType,
    file: File
  ): Promise<UploadResult> => {
    // Validação
    if (file.type !== 'application/pdf') {
      throw new Error('Apenas arquivos PDF são permitidos');
    }

    const fileName = `${type}_${Date.now()}.pdf`;
    const filePath = `docs_legais/${fileName}`;

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size
    };
  },

  /**
   * Upload de evidências de indicadores
   * Bucket: 'evidence'
   * Path: indicators/YEAR/INDICATORCODE_MONTH_proof.EXT
   */
  uploadIndicatorEvidence: async ({
    indicatorCode,
    year,
    month,
    file
  }: IndicatorEvidenceUpload): Promise<UploadResult> => {
    const ext = file.name.split('.').pop();
    const fileName = `${indicatorCode}_${month}_proof.${ext}`;
    const filePath = `indicators/${year}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('evidence')
      .upload(filePath, file, {
        upsert: true // Permite sobrescrever evidências antigas
      });

    if (error) {
      throw new Error(`Erro ao fazer upload de evidência: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('evidence')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size
    };
  },

  /**
   * Upload de avatar de usuário
   * Bucket: 'avatars'
   * Path: users/USER_ID.EXT
   */
  uploadUserAvatar: async (userId: string, file: File): Promise<UploadResult> => {
    // Validar tipo de imagem
    if (!file.type.startsWith('image/')) {
      throw new Error('Apenas arquivos de imagem são permitidos');
    }

    const ext = file.name.split('.').pop();
    const filePath = `users/${userId}.${ext}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      });

    if (error) {
      throw new Error(`Erro ao fazer upload de avatar: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size
    };
  },

  /**
   * Upload de relatório/export
   * Bucket: 'exports'
   * Path: reports/TYPE_TIMESTAMP.EXT
   */
  uploadExport: async (type: string, file: File): Promise<UploadResult> => {
    const ext = file.name.split('.').pop();
    const fileName = `${type}_${Date.now()}.${ext}`;
    const filePath = `reports/${fileName}`;

    const { data, error } = await supabase.storage
      .from('exports')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Erro ao fazer upload de export: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('exports')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size
    };
  },

  /**
   * Download de arquivo
   */
  downloadFile: async (bucket: string, path: string): Promise<Blob> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Erro ao fazer download: ${error.message}`);
    }

    return data;
  },

  /**
   * Listar arquivos de um indicador específico
   */
  listIndicatorFiles: async (indicatorCode: string, year?: number): Promise<any[]> => {
    const folder = year ? `indicators/${year}` : 'indicators';

    const { data, error } = await supabase.storage
      .from('evidence')
      .list(folder, {
        search: indicatorCode
      });

    if (error) {
      throw new Error(`Erro ao listar arquivos: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Deletar arquivo
   */
  deleteFile: async (bucket: string, path: string): Promise<void> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  },

  /**
   * Obter URL pública de um arquivo
   */
  getPublicUrl: (bucket: string, path: string): string => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  },

  /**
   * Obter URL assinada (privada) de um arquivo
   * Expira em X segundos (padrão: 1 hora)
   */
  getSignedUrl: async (
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
    }

    return data.signedUrl;
  }
};

// ========================================
// GCP STORAGE (Processamento - Opcional)
// ========================================

/**
 * Integrações com Google Cloud Storage
 *
 * IMPORTANTE: Estas funções devem ser executadas no BACKEND (Cloud Functions)
 * não no frontend. São apenas exemplos de como integrar.
 */
export const gcpStorage = {
  /**
   * Backup assíncrono do Supabase para GCS
   * Deve ser executado via Cloud Function/Scheduler
   */
  backupToGCS: async (supabaseBucket: string, supabasePath: string) => {
    // Esta função seria executada em uma Cloud Function
    // Não deve ser chamada diretamente do frontend

    console.warn('gcpStorage.backupToGCS deve ser executado em Cloud Function');

    // Exemplo de implementação (backend):
    /*
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();

    // 1. Download do Supabase
    const blob = await supabaseStorage.downloadFile(supabaseBucket, supabasePath);

    // 2. Upload para GCS
    const bucket = storage.bucket('planejagov-backups');
    const file = bucket.file(`supabase-mirror/${supabaseBucket}/${supabasePath}`);

    await file.save(Buffer.from(await blob.arrayBuffer()));
    return file.publicUrl();
    */
  },

  /**
   * Salvar resultado do Document AI (processado)
   * Deve ser executado via Cloud Function após processamento
   */
  saveDocumentAIResult: async (documentId: string, analysisResult: any) => {
    console.warn('gcpStorage.saveDocumentAIResult deve ser executado em Cloud Function');

    // Exemplo de implementação (backend):
    /*
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();

    const bucket = storage.bucket('planejagov-ai-results');
    const file = bucket.file(`document-ai/${documentId}.json`);

    await file.save(JSON.stringify(analysisResult, null, 2), {
      contentType: 'application/json',
      metadata: {
        processedAt: new Date().toISOString()
      }
    });

    return file.name;
    */
  }
};

// ========================================
// HELPERS
// ========================================

/**
 * Formatar tamanho de arquivo para exibição
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validar extensão de arquivo
 */
export const validateFileExtension = (
  filename: string,
  allowedExtensions: string[]
): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
};

/**
 * Validar tamanho máximo de arquivo
 */
export const validateFileSize = (
  file: File,
  maxSizeMB: number
): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};
