import { Request, Response } from 'express';
import { commodityService } from '../services/commodity.service.js';

export class CommodityController {
  getRates = async (req: Request, res: Response): Promise<void> => {
    try {
      const force = req.query.force === 'true';
      const data = await commodityService.getCommodities(force);
      console.log(data)
      res.json({ success: true, data });
    } catch (error: any) {
      console.error('[CommodityController] Erro ao obter cotações:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Falha ao obter cotações de commodities',
      });
    }
  };

  refreshRates = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await commodityService.getCommodities(true);
      console.log(data)
      res.json({
        success: true,
        message: 'Cotações atualizadas com sucesso!',
        data,
      });
    } catch (error: any) {
      console.error('[CommodityController] Erro ao atualizar cotações:', error);
      res.status(400).json({
        success: false,
        error: error?.message || 'Falha ao sincronizar com Commodities-API',
      });
    }
  };
}
