import { prisma } from '../config/prisma.js';
import { FleetItem, CreateFleetItemDTO, UpdateFleetItemDTO } from '../models/fleet.model.js';

function mapToFleetItem(item: any): FleetItem {
  return {
    ...item,
    id: item.id,
    _id: item.id,
  };
}

export class FleetRepository {
  async findAll(): Promise<FleetItem[]> {
    const items = await prisma.fleetItem.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return items.map(mapToFleetItem);
  }

  async findActive(): Promise<FleetItem[]> {
    const items = await prisma.fleetItem.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return items.map(mapToFleetItem);
  }

  async findById(id: string): Promise<FleetItem | null> {
    try {
      const item = await prisma.fleetItem.findUnique({
        where: { id },
      });
      return item ? mapToFleetItem(item) : null;
    } catch {
      return null;
    }
  }

  async create(data: CreateFleetItemDTO): Promise<FleetItem> {
    const { id: _, _id: __, ...rest } = data as any;
    const item = await prisma.fleetItem.create({
      data: {
        title: rest.title,
        description: rest.description,
        imageUrl: rest.imageUrl,
        order: rest.order ?? 0,
        active: rest.active ?? true,
        category: rest.category ?? null,
      },
    });
    return mapToFleetItem(item);
  }

  async update(id: string, data: UpdateFleetItemDTO): Promise<FleetItem | null> {
    try {
      const { id: _, _id: __, createdAt: ___, updatedAt: ____, ...cleanData } = data as any;
      const item = await prisma.fleetItem.update({
        where: { id },
        data: cleanData,
      });
      return mapToFleetItem(item);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.fleetItem.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
