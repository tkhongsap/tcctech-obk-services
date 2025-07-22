import { Prisma } from '../../db/client';
import { TypeResult } from './type_controller.interfaces';

function typesSerializer(type: Prisma.typeGetPayload<true>[]): TypeResult[] {
  return type.map((item) => {
    return {
      id: item.id,
      type: item.type,
    };
  });
}
function typeSerializer(type: Prisma.typeGetPayload<true>): TypeResult {
  return {
    id: type.id,
    type: type.type,
  };
}
export { typeSerializer, typesSerializer };
