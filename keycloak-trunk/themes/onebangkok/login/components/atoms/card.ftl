<#macro kw content="" footer="" header="">
  <#--  <div class="bg-white p-8 rounded-lg space-y-6">  -->
  <div class="card-container">
    <#if header?has_content>
      <div class="space-y-4 padding-card">
        ${header}
      </div>
    </#if>
    <#if content?has_content>
      <div class="space-y-4 padding-card">
        ${content}
      </div>
    </#if>
    <#if footer?has_content>
      <div class="space-y-4">
        ${footer}
      </div>
    </#if>
  </div>
</#macro>
