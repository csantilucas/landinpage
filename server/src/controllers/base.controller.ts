import { Request, Response } from 'express';
import { BaseService } from '../services/base.service.js';

export class BaseController {
  constructor(private baseService = new BaseService()) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    try {
      const bases = await this.baseService.getActiveBases();
      res.json({ success: true, data: bases });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const bases = await this.baseService.getAllBases();
      res.json({ success: true, data: bases });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const base = await this.baseService.getBaseById(id);
      if (!base) {
        res.status(404).json({ success: false, error: 'Base operacional não encontrada' });
        return;
      }
      res.json({ success: true, data: base });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const created = await this.baseService.createBase(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await this.baseService.updateBase(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const deleted = await this.baseService.deleteBase(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}