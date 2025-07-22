import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma'; // Adjust path as needed

@Injectable()
export class PrismaService extends PrismaClient {}
