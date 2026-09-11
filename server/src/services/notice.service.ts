import { NoticeRepository } from '../repositories/notice.repository.js';
import { Notice, CreateNoticeDTO, UpdateNoticeDTO } from '../models/notice.model.js';

export class NoticeService {
  constructor(private noticeRepo = new NoticeRepository()) {}

  async getAllNotices(): Promise<Notice[]> {
    return this.noticeRepo.findAll();
  }

  async getActiveNotices(): Promise<Notice[]> {
    return this.noticeRepo.findActive();
  }

  async getNoticeById(id: string): Promise<Notice> {
    const notice = await this.noticeRepo.findById(id);
    if (!notice) {
      throw new Error('Aviso não encontrado');
    }
    return notice;
  }

  async createNotice(data: CreateNoticeDTO): Promise<Notice> {
    if (!data.title?.trim()) {
      throw new Error('O título do aviso é obrigatório');
    }
    const description = (data.description || data.message || '').trim();
    if (!description) {
      throw new Error('A descrição do aviso é obrigatória');
    }

    const payload: CreateNoticeDTO = {
      title: data.title.trim(),
      description: description,
      message: description,
      active: data.active ?? true,
      imageUrl: data.imageUrl?.trim() || undefined,
      linkUrl: data.linkUrl?.trim() || undefined,
      linkText: data.linkText?.trim() || undefined,
      type: data.type || undefined,
      priority: Number(data.priority) || 0,
    };

    return this.noticeRepo.create(payload);
  }

  async updateNotice(id: string, data: UpdateNoticeDTO): Promise<Notice> {
    const existing = await this.getNoticeById(id);
    if (!existing) {
      throw new Error('Aviso não encontrado para atualização');
    }

    const description = data.description !== undefined 
      ? data.description.trim() 
      : (data.message !== undefined ? data.message.trim() : undefined);

    const payload: UpdateNoticeDTO = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(description !== undefined && { description, message: description }),
      ...(data.active !== undefined && { active: Boolean(data.active) }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() || undefined }),
      ...(data.linkUrl !== undefined && { linkUrl: data.linkUrl.trim() || undefined }),
      ...(data.linkText !== undefined && { linkText: data.linkText.trim() || undefined }),
    };

    const updated = await this.noticeRepo.update(id, payload);
    if (!updated) {
      throw new Error('Falha ao atualizar aviso');
    }
    return updated;
  }

  async deleteNotice(id: string): Promise<boolean> {
    const success = await this.noticeRepo.delete(id);
    if (!success) {
      throw new Error('Aviso não encontrado para exclusão');
    }
    return true;
  }

  async toggleActive(id: string): Promise<Notice> {
    const toggled = await this.noticeRepo.toggleActive(id);
    if (!toggled) {
      throw new Error('Aviso não encontrado para alternar status');
    }
    return toggled;
  }
}
