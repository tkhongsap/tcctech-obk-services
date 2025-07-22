import { Controller, Get, OperationId, Route, Queries, Post, Body, Put, Path, Delete } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { Prisma } from '../../db/client';
import { CreateOrUpdateTypeBody, TypeIndexQuery, TypeResult } from './type_controller.interfaces';
import TypeRepository from '../repositories/type_repository';
import Enumerable = Prisma.Enumerable;
import typeWhereInput = Prisma.typeWhereInput;
import { typeSerializer, typesSerializer } from './type_controller.serializer';

@Route('type')
export class Type extends Controller {
  @Get('')
  @OperationId('type.show')
  public async show(@Queries() query: TypeIndexQuery): Promise<WrappedResponse<TypeResult>> {
    let AND: Enumerable<typeWhereInput> = {};
    const { name } = query;
    if (name) {
      AND = { type: name };
    }
    const TypeData = await TypeRepository.findMany({ where: AND });
    this.setStatus(200);
    if (TypeData) {
      return { data: typesSerializer(TypeData) };
    }
    return { data: null };
  }
  @Post()
  @OperationId('type.create')
  public async create(@Body() body: CreateOrUpdateTypeBody): Promise<WrappedResponse<TypeResult>> {
    try {
      const { name } = body;
      const typeData = await TypeRepository.create({
        data: {
          type: name,
        },
      });
      this.setStatus(200);
      return { data: typeSerializer(typeData) };
    } catch (error) {
      return { data: null };
    }
  }

  @Put('{id}')
  @OperationId('type.update')
  public async update(@Path() id: string, @Body() body: CreateOrUpdateTypeBody): Promise<WrappedResponse<TypeResult>> {
    try {
      const typeData = await TypeRepository.update({
        where: {
          id,
        },
        data: body,
      });

      this.setStatus(200);
      return { data: typeSerializer(typeData) };
    } catch (error) {
      return { data: null };
    }
  }

  @Delete('{id}')
  @OperationId('type.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<true>> {
    try {
      await TypeRepository.delete({
        where: {
          id,
        },
      });

      this.setStatus(200);
      return { data: true };
    } catch (error) {
      return { data: null };
    }
  }
}
