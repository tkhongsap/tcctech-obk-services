import { isEmpty } from 'lodash';
import RecipientRepository from '../repositories/recipient_repository';
import TargetGroupMemberRepository from '../repositories/target_group_member';
import TargetGroupRepository from '../repositories/target_group_repository';
import { TargetGroupBody, TargetGroupResponse } from './interfaces/target_group_interface';
import logging from '../libs/logging';
import { OBError } from '../libs/error_spec';
import { CustomError } from '../middlewares/error';

export class TargetGroupService {
  public async create(data: TargetGroupBody): Promise<TargetGroupResponse> {
    let targetGroup = await TargetGroupRepository.findFirst({ where: { name: data.name } });

    if (!targetGroup) {
      targetGroup = await TargetGroupRepository.create({ data: { name: data.name } });
    }

    const recipientIds = await this.getValidRecipientIds(data.account_id_group);

    if (targetGroup && !isEmpty(recipientIds)) {
      await this.clearExistingGroupMembers(targetGroup.id);
      await this.createTargetGroupMembers(targetGroup.id, recipientIds);
    } else {
      logging.info('No valid recipients found, skipping TargetGroupMember creation.');
    }

    if (!targetGroup) throw new CustomError(OBError.NOTI_TARG_001);

    return targetGroup;
  }

  private async getValidRecipientIds(accountIds: string[]): Promise<string[]> {
    const recipientIds = await Promise.all(
      accountIds.map(async (accountId) => {
        const recipient = await RecipientRepository.findFirst({
          where: { account_id: accountId },
          select: { id: true },
        });

        if (!recipient) {
          logging.info(`Cannot find recipient for account id: ${accountId}`);
          return null;
        }

        return recipient.id;
      }),
    );

    return recipientIds.filter((id): id is string => id !== null);
  }

  private async clearExistingGroupMembers(targetGroupId: string): Promise<void> {
    await TargetGroupMemberRepository.deleteMany({
      where: {
        target_group_id: targetGroupId,
      },
    });
  }
  private async createTargetGroupMembers(targetGroupId: string, recipientIds: string[]): Promise<void> {
    const targetGroupMembersData = recipientIds.map((recipientId) => ({
      target_group_id: targetGroupId,
      recipient_id: recipientId,
    }));

    await TargetGroupMemberRepository.createMany({
      data: targetGroupMembersData,
    });
  }

  public async createTargetGroup(data: TargetGroupBody): Promise<TargetGroupResponse> {
    let targetGroup = await TargetGroupRepository.findFirst({ where: { name: data.name } });
    if (!this.isNullOrEmpty(data.name)) {
      if (!targetGroup) {
        targetGroup = await TargetGroupRepository.create({ data: { name: data.name } });
      }
    }

    if (data.account_id_group.length > 0) {
      const recipientIds = await this.getValidRecipientIds(data.account_id_group);

      if (targetGroup && !isEmpty(recipientIds)) {
        const uniqueRecipientIds = await this.checkDuplicateRecipientIds(recipientIds, targetGroup.id);
        if (!isEmpty(uniqueRecipientIds)) {
          await this.createTargetGroupMembers(targetGroup.id, uniqueRecipientIds);
        } else {
          logging.info('All recipient IDs are duplicates, skipping TargetGroupMember creation.');
        }
      } else {
        logging.info('No valid recipients found, skipping TargetGroupMember creation.');
      }
    }

    if (!targetGroup) throw new CustomError(OBError.NOTI_TARG_001);

    return targetGroup;
  }

  private async checkDuplicateRecipientIds(recipientIds: string[], targetGroupId: string): Promise<string[]> {
    // Fetch existing recipients for the target group
    const existingRecipients = await TargetGroupMemberRepository.findMany({
      where: { target_group_id: targetGroupId },
      select: { recipient_id: true },
    });

    // Extract only the recipient IDs from the existing data
    const existingRecipientIds = new Set(existingRecipients.map((member) => member.recipient_id));

    // Filter out recipientIds that are already in the existingRecipientIds
    const uniqueRecipientIds = recipientIds.filter((id) => !existingRecipientIds.has(id));

    return uniqueRecipientIds;
  }
  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value.trim() === '';
  }
}
