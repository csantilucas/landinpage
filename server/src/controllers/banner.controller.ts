import { Request, Response } from 'express';
import { BannerService } from '../services/banner.service.js';

export class BannerController {
  constructor(private bannerService = new BannerService()) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    try {
      const banners = await this.bannerService.getActiveBanners();
      res.json({ success: true, data: banners });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const banners = await this.bannerService.getAllBanners();
      res.json({ success: true, data: banners });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
	const id = String(req.params.id)
      const banner = await this.bannerService.getBannerById(id);
      if (!banner) {
        res.status(404).json({ success: false, error: 'Banner não encontrado' });
        return;
      }
      res.json({ success: true, data: banner });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const created = await this.bannerService.createBanner(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
const id =String(req.params.id)
      const updated = await this.bannerService.updateBanner(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
const id = String(req.params.id)
      const deleted = await this.bannerService.deleteBanner(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
