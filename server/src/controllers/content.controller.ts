import { Request, Response } from 'express';
import { ContentService } from '../services/content.service.js';

export class ContentController {
  constructor(private contentService = new ContentService()) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const contents = await this.contentService.getAllContents();
      res.json({ success: true, data: contents });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getByKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.contentService.getContentByKey(req.params.key);
      if (!data) {
        res.status(404).json({ success: false, error: 'Conteúdo não encontrado' });
        return;
      }
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await this.contentService.updateContent(req.params.key, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
