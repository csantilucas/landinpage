import { Request, Response } from 'express';
import { NoticeService } from '../services/notice.service.js';

export class NoticeController {
  constructor(private noticeService = new NoticeService()) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notices = await this.noticeService.getActiveNotices();
      res.json({ success: true, data: notices });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notices = await this.noticeService.getAllNotices();
      res.json({ success: true, data: notices });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const notice = await this.noticeService.getNoticeById(id);
      res.json({ success: true, data: notice });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const notice = await this.noticeService.createNotice(req.body);
      res.status(201).json({ success: true, data: notice });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await this.noticeService.updateNotice(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.noticeService.deleteNotice(id);
      res.json({ success: true, message: 'Aviso excluído com sucesso' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  toggle = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const toggled = await this.noticeService.toggleActive(id);
      res.json({ success: true, data: toggled });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}