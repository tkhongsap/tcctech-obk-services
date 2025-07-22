import { Prisma } from '../../db/client';
import { SR_REFERENCES_LENGTH, SR_REFERENCES_PREFIX } from '../consts/service_request';
import { formatReference } from '../utils/references_code';
import { RequesterData } from './ac_requests_controller.interfaces';
import { ServiceRequestData } from './service_requests_controller.interface';

type ServiceRequestSerializerInput = Prisma.ServiceRequestGetPayload<{
  include: {
    requester: {
      include: {
        tenant_members: {
          include: {
            tenant: true;
          };
        };
      };
    };
    tower: true;
    issue_type: true;
    floor: true;
  };
}>;

function serviceRequestsSerializer(serviceRequests: ServiceRequestSerializerInput[]): ServiceRequestData[] {
  return serviceRequests.map((serviceRequest) => serviceRequestSerializer(serviceRequest));
}
function serviceRequestSerializer(serviceRequest: ServiceRequestSerializerInput): ServiceRequestData {
  const requester: RequesterData = {
    ...serviceRequest.requester,
    id: serviceRequest.requester.id,
    uid: serviceRequest.requester.uid,
    account_id: serviceRequest.requester.account_id,
    metadata: serviceRequest.requester.metadata,
    created_at: serviceRequest.requester.created_at.toISOString(),
    updated_at: serviceRequest.requester.updated_at.toISOString(),
    tenant_members: serviceRequest.requester.tenant_members?.map((tenantMember) => ({
      tenant: tenantMember.tenant,
    })) as any,
  };

  const serviceRequestData: ServiceRequestData = {
    id: serviceRequest.id,
    image_url: serviceRequest.image_url,
    requester_id: serviceRequest.requester.id,
    issue_type: {
      id: serviceRequest.issue_type.id,
      name: serviceRequest.issue_type.name,
      display_name: serviceRequest.issue_type.display_name,
      internal_remark: serviceRequest.issue_type.internal_remark,
      created_at: serviceRequest.issue_type.created_at.toISOString(),
      updated_at: serviceRequest.issue_type.updated_at.toISOString(),
    },
    tower: {
      id: serviceRequest.tower.id,
      name: serviceRequest.tower.name,
      uid: serviceRequest.tower.uid,
      project_id: serviceRequest.tower.project_id,
      display_name: serviceRequest.tower.display_name,
      created_at: serviceRequest.tower.created_at.toISOString(),
      updated_at: serviceRequest.tower.updated_at.toISOString(),
    },
    floor: {
      id: serviceRequest.floor.id,
      name: serviceRequest.floor.name,
      uid: serviceRequest.floor.uid,
      display_name: serviceRequest.floor.display_name,
      tower_id: serviceRequest.floor.tower_id,
      created_at: serviceRequest.floor.created_at.toISOString(),
      updated_at: serviceRequest.floor.updated_at.toISOString(),
    },
    title: serviceRequest.title,
    description: serviceRequest.description,
    status: serviceRequest.status,
    references: formatReference(
      serviceRequest.created_at.toISOString(),
      serviceRequest.references.toString(),
      SR_REFERENCES_LENGTH,
      SR_REFERENCES_PREFIX,
    ),
    requester: requester,
    created_at: serviceRequest.created_at.toISOString(),
    updated_at: serviceRequest.updated_at.toISOString(),
    internal_remark: serviceRequest.internal_remark,
  };
  return serviceRequestData;
}

export { serviceRequestSerializer, serviceRequestsSerializer };
