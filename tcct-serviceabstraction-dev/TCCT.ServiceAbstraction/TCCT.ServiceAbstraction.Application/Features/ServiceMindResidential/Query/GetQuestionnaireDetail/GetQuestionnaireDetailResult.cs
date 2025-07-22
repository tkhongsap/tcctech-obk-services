namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireDetail;

public class GetQuestionnaireDetailResult
{
    public GetQuestionnaireDetailResultData? data { get; set; }
}

public class GetQuestionnaireDetailResultData
{
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? fromDate { get; set; }
    public string? toDate { get; set; }
    public string? duration { get; set; }
    public string? durationUnit { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
    public bool? isActive { get; set; }
    public int? status { get; set; }
    public int? activeUntil { get; set; }
    public string? projectId { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public BannerImage? bannerImage { get; set; }
    public bool? alreadySubmitted { get; set; }
    public string? submittedAt { get; set; }
    public List<GetQuestionnaireDetailResultDataSections>? sections { get; set; }
}

public class GetQuestionnaireDetailResultDataSections
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionnaireId { get; set; }
    public long? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }  
    public long? updatedBy { get; set; }
    public bool? isDeleted { get; set; }
    public string? title { get; set; }
    public GetQuestionnaireDetailResultDataQuestionInlineImage? inlineImage { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestion>? questions { get; set; }
}
public class BannerImage
{
    public int? id { get; set; }
    public int? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public int? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? refImageUrl { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestion
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionnaireId { get; set; }
    public int? type { get; set; }
    public bool? allowImageUpload { get; set; } 
    public bool? allowFileUpload { get; set; }
    public bool? required { get; set; }
    public int? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
    public bool? isDeleted { get; set; }
    public int? sectionId { get; set; }
    public string? question { get; set; }
    public int? minLength { get; set; }
    public int? maxLength { get; set; }
    public string? questionTypeName { get; set; } 
    public List<GetQuestionnaireDetailResultDataQuestionOption>? options { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestionAnswer>? answers { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestionImage>? images { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestionFile>? files { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionOption
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? text { get; set; }
    public bool? otherOption { get; set; }
    public int? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionInlineImage
{
    public int? id { get; set; }
    public int? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public int? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? refImageUrl { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionAnswer
{
    public int? questionId { get; set; }
    public string? answer { get; set; }
    public int? selectedOptionId { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionImage
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? tenantId { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? url { get; set; }
    public long? createdAt { get; set; }
    public int? createdBy { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionFile
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? tenantId { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? url { get; set; }
    public long? createdAt { get; set; }
    public int? createdBy { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}
