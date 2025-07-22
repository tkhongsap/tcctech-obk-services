import { OperationId, Route, Get, Queries, Post, Body, Path, Put, Delete, Header } from 'tsoa';
import { ResponseData } from '../base_controller.interfaces';
import CampaignRepository from '../../repositories/campaign_repository';
import { CampaignStatus, Prisma } from '../../../db/client/';
import { BaseController, Pagination } from '../base_controller';
import { CampaignsIndexQuery, CampaignsCreateRequestBody, CampaignData, PushNotificationData } from './index.interface';
import { campaignSerializer } from './campaigns_controller.serializer';
import { CampaignService } from '../../services/campaign_service';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../libs/error_spec';
import { isEmpty, map, set } from 'lodash';
import { TargetGroupService } from '../../services/target_group_service';
import TargetGroupMemberRepository from '../../repositories/target_group_member';
import RecipientRepository from '../../repositories/recipient_repository';
import logging from '../../utils/logging';

@Route('campaigns')
export class CampaignsController extends BaseController {
  @Get('')
  @OperationId('campaigns.index')
  public async index(@Queries() query?: CampaignsIndexQuery): Promise<ResponseData<CampaignData[]>> {
    const { orderBy, ..._query } = this.buildQuery<Prisma.campaignFindManyArgs>({ ...query });
    const orderByCondition =
      query?.order_by === 'message_template_id'
        ? {
            message_template: {
              message_category: {
                name: query.order_direction as Prisma.SortOrder,
              },
            },
          }
        : orderBy;
    const campaigns = await CampaignRepository.findMany({
      ..._query,
      orderBy: orderByCondition,
      include: { ...CampaignRepository.defaultInclude },
    });
    const totalData = await CampaignRepository.count({ where: _query.where });
    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    this.setStatus(200);
    const serailizedCampaigns = map(campaigns, (campaign) => {
      return campaignSerializer(campaign);
    });

    return { data: serailizedCampaigns, pagination };
  }

  @Post('')
  @OperationId('campaigns.create')
  public async create(
    @Body() body: CampaignsCreateRequestBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    const { target_group_id, targetGroupDetails } = body;
    const hasTargetGroupDetail =
      isEmpty(target_group_id) && targetGroupDetails?.name && targetGroupDetails.account_id_group;

    try {
      if (hasTargetGroupDetail) {
        const targetGroupService = new TargetGroupService();
        const targetGroup = await targetGroupService.create(targetGroupDetails);
        set(body, 'target_group_id', targetGroup.id);
      }

      const campaign = await campaignService.create({
        ...body,
      });
      this.setStatus(200);
      return { data: campaignSerializer(campaign) };
    } catch (error: any) {
      return error;
    }
  }

  @Get('{id}')
  @OperationId('campaigns.show')
  public async show(@Path() id: string): Promise<ResponseData<CampaignData>> {
    const campaign = await CampaignRepository.findFirst({ where: { id }, include: CampaignRepository.defaultInclude });

    if (!campaign) {
      this.setStatus(404);
      throw new CustomError(OBError.NOTI_CAMPAIGN_001);
    }

    // TODO: Need to refactor this code to make FE and BE data consistent
    // check is this campaign has csv file
    const csvFile = await TargetGroupMemberRepository.findMany({
      where: {
        target_group_id: campaign.campaign_target_groups[0].target_group_id,
      },
    });

    if (csvFile.length > 0) {
      logging.info('start formatting campaign with CSV file');
      const targetGroupName = campaign.campaign_target_groups[0].target_group.name;
      const recipientIds = csvFile.map((recipient) => recipient.recipient_id);
      const accountIds = await RecipientRepository.findMany({
        where: {
          id: {
            in: recipientIds,
          },
        },
        select: {
          account_id: true,
        },
      });
      logging.info(`accountIds : ${accountIds}`);

      const serializedCampaign = campaignSerializer(campaign!);
      const campaignWithCSVFile = {
        ...serializedCampaign,
        target_groups: [{ account_id_group: accountIds, name: targetGroupName }],
      };

      this.setStatus(200);
      return { data: campaignWithCSVFile };
    }

    this.setStatus(200);
    return { data: campaignSerializer(campaign!) };
  }

  @Put('{id}')
  @OperationId('campaigns.update')
  public async update(
    @Path() id: string,
    @Body() body: CampaignsCreateRequestBody,
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    const { target_group_id, targetGroupDetails } = body;

    const hasTargetGroupDetail =
      isEmpty(target_group_id) && targetGroupDetails?.name && targetGroupDetails.account_id_group;
    if (hasTargetGroupDetail) {
      const targetGroupService = new TargetGroupService();
      const targetGroup = await targetGroupService.create(targetGroupDetails);
      set(body, 'target_group_id', targetGroup.id);
    }
    const campaign = await campaignService.update(id, { ...body, updated_by: accountId });

    this.setStatus(200);
    return { data: campaignSerializer(campaign) };
  }

  @Delete('{id}')
  @OperationId('campaigns.delete')
  public async delete(@Path() id: string): Promise<void> {
    await CampaignRepository.delete({ where: { id } });
    this.setStatus(200);
  }

  @Post('{id}/submit')
  @OperationId('campaigns.submit')
  public async submit(
    @Path() id: string,
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    // const campaign = await campaignService.update(id, {
    //   submitted_at: new Date(),
    //   status: 'WATING_FOR_APPROVAL',
    //   updated_by: accountId,
    //   submitted_by: accountId,
    // });
    const campaign = await campaignService.updateStatus(id, accountId!, {
      submitted_at: new Date(),
      status: CampaignStatus.WATING_FOR_APPROVAL,
      updated_by: accountId,
      submitted_by: accountId,
    });

    this.setStatus(200);
    return { data: campaignSerializer(campaign) };
  }

  @Post('{id}/approve')
  @OperationId('campaigns.approve')
  public async approve(
    @Path() id: string,
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    // const campaign = await campaignService.update(id, {
    //   status: 'APPROVED_SCHEDULED',
    //   updated_by: accountId,
    // });
    const campaign = await campaignService.updateStatus(id, accountId!, {
      status: CampaignStatus.APPROVED_SCHEDULED,
      updated_by: accountId,
    });

    this.setStatus(200);
    return { data: campaignSerializer(campaign) };
  }

  @Post('{id}/reject')
  @OperationId('campaigns.reject')
  public async reject(
    @Path() id: string,
    @Body() body: { note: string },
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    // const campaign = await campaignService.update(id, {
    //   status: 'REJECTED',
    //   note: body?.note || '',
    //   updated_by: accountId,
    // });
    const campaign = await campaignService.updateStatus(id, accountId!, {
      status: CampaignStatus.REJECTED,
      note: body?.note || '',
      updated_by: accountId,
    });

    this.setStatus(200);
    return { data: campaignSerializer(campaign) };
  }

  @Post('{id}/duplicate')
  @OperationId('campaigns.duplicate')
  public async duplicate(
    @Path() id: string,
    @Header('x-account-id') accountId?: string,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();
    const campaign = await CampaignRepository.findFirst({
      where: { id },
      include: CampaignRepository.defaultInclude,
    }).catch((err) => console.log('Get campaign error', err));
    if (!campaign) {
      throw new CustomError(OBError.NOTI_CAMPAIGN_001);
    }
    const newCampaign = await campaignService.create({
      name: `${campaign.name} - copy`,
      message_template: {
        ...campaign.message_template,
      } as any,
      message_category_id: campaign.message_template?.message_category_id,
      push_notification_data:
        campaign.push_notification_data !== null
          ? (campaign.push_notification_data as unknown as PushNotificationData)
          : undefined,
      scheduled_at: campaign.scheduled_at?.toISOString(),
      tags: map(campaign.tag_on_campaigns, (tag) => tag.id),
      target_group_id: campaign.campaign_target_groups && campaign.campaign_target_groups[0].target_group_id,
      updated_by: accountId,
    });

    this.setStatus(200);
    return { data: campaignSerializer(newCampaign) };
  }

  @Post('sent')
  @OperationId('campaigns.sent')
  public async sent(): Promise<void> {
    const campaignService = new CampaignService();
    await campaignService.sent();
    this.setStatus(200);
  }

  @Post('/residential')
  @OperationId('campaigns_residential.create')
  public async createCampaignResidential(
    @Body() body: CampaignsCreateRequestBody,
  ): Promise<ResponseData<CampaignData>> {
    const campaignService = new CampaignService();

    const campaign = await campaignService.createCampaignResidential({
      ...body,
      // created_by: accountId,
      // updated_by: accountId,
    });
    this.setStatus(200);
    return { data: campaignSerializer(campaign) };
  }
  catch(error: any) {
    return error;
  }

  @Post('/residential/sent')
  @OperationId('campaigns_residential.sent')
  public async residentialSent(@Body() body: { campaignIds: string[] }): Promise<void> {
    const campaignService = new CampaignService();
    await campaignService.residentialSent(body.campaignIds);
    this.setStatus(200);
  }
}
