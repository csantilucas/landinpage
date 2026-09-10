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
    if (!data.message?.trim()) {
      throw new Error('A mensagem do aviso é obrigatória');
    }

    const payload: CreateNoticeDTO = {
      title: data.title.trim(),
      message: data.message.trim(),
      type: data.type || 'info',
      active: data.active ?? true,
      priority: Number(data.priority) || 0,
      imageUrl: data.imageUrl?.trim() || undefined,
      linkUrl: data.linkUrl?.trim() || undefined,
      linkText: data.linkText?.trim() || undefined,
    };

    return this.noticeRepo.create(payload);
  }

  async updateNotice(id: string, data: UpdateNoticeDTO): Promise<Notice> {
    const existing = await this.getNoticeById(id);
    if (!existing) {
      throw new Error('Aviso não encontrado para atualização');
    }

    const payload: UpdateNoticeDTO = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.message !== undefined && { message: data.message.trim() }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.active !== undefined && { active: Boolean(data.active) }),
      ...(data.priority !== undefined && { priority: Number(data.priority) }),
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
