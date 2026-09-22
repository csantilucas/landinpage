import { Request, Response } from 'express';
import { FleetService } from '../services/fleet.service.js';

export class FleetController {
  constructor(private fleetService = new FleetService()) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.fleetService.getActiveItems();
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.fleetService.getAllItems();
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const item = await this.fleetService.getItemById(id);
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.fleetService.createItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await this.fleetService.updateItem(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.fleetService.deleteItem(id);
      res.json({ success: true, message: 'Item da frota excluído com sucesso' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}