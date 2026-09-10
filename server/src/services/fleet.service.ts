import { FleetRepository } from '../repositories/fleet.repository.js';
import { FleetItem, CreateFleetItemDTO, UpdateFleetItemDTO } from '../models/fleet.model.js';

export class FleetService {
  constructor(private fleetRepo = new FleetRepository()) {}

  async getAllItems(): Promise<FleetItem[]> {
    return this.fleetRepo.findAll();
  }

  async getActiveItems(): Promise<FleetItem[]> {
    return this.fleetRepo.findActive();
  }

  async getItemById(id: string): Promise<FleetItem> {
    const item = await this.fleetRepo.findById(id);
    if (!item) {
      throw new Error('Item da frota não encontrado');
    }
    return item;
  }

  async createItem(data: CreateFleetItemDTO): Promise<FleetItem> {
    if (!data.imageUrl?.trim()) {
      throw new Error('O link da imagem (URL) é obrigatório');
    }
    if (!data.title?.trim()) {
      throw new Error('O título ou identificação do veículo é obrigatório');
    }

    const payload: CreateFleetItemDTO = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      imageUrl: data.imageUrl.trim(),
      order: Number(data.order) || 0,
      active: data.active ?? true,
      category: data.category?.trim() || 'carrossel',
    };

    return this.fleetRepo.create(payload);
  }

  async updateItem(id: string, data: UpdateFleetItemDTO): Promise<FleetItem> {
    const existing = await this.getItemById(id);
    if (!existing) {
      throw new Error('Item da frota não encontrado');
    }

    const payload: UpdateFleetItemDTO = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.active !== undefined && { active: Boolean(data.active) }),
      ...(data.category !== undefined && { category: data.category }),
    };

    const updated = await this.fleetRepo.update(id, payload);
    if (!updated) {
      throw new Error('Falha ao atualizar item da frota');
    }
    return updated;
  }

  async deleteItem(id: string): Promise<boolean> {
    const success = await this.fleetRepo.delete(id);
    if (!success) {
      throw new Error('Item da frota não encontrado para exclusão');
    }
    return true;
  }
}
