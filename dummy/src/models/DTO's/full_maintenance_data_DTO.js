class FullMaintenanceDataDTO {
    constructor({
        idRevision,
        revisionDate,
        areaName,
        categoryName,
        taskDescription,
        revisionResponsibleName,
        revisionResponsibleEmail,
        revisionQuantity,
        statusOfRevision,
        revisionQuantityFailed,
        revisionObservations,
        maintenanceDetails,
        actionPlanDate,
        actionPlanResponsibleName,
        actionPlanResponsibleEmail,
        followUpDate,
        idFollowUp,
        idActionPlan,
        actionPlanResponsibleId,
        revisionResponsibleId,
        idTask,
        idCategory,
        idArea
    }) {
        this.idRevision = idRevision;
        this.revisionDate = revisionDate;
        this.areaName = areaName;
        this.categoryName = categoryName;
        this.taskDescription = taskDescription;
        this.revisionResponsibleName = revisionResponsibleName;
        this.revisionResponsibleEmail = revisionResponsibleEmail;
        this.revisionQuantity = revisionQuantity;
        this.statusOfRevision = statusOfRevision;
        this.revisionQuantityFailed = revisionQuantityFailed;
        this.revisionObservations = revisionObservations;
        this.maintenanceDetails = maintenanceDetails;
        this.actionPlanDate = actionPlanDate;
        this.actionPlanResponsibleName = actionPlanResponsibleName;
        this.actionPlanResponsibleEmail = actionPlanResponsibleEmail;
        this.followUpDate = followUpDate;
        this.idFollowUp = idFollowUp;
        this.idActionPlan = idActionPlan;
        this.actionPlanResponsibleId = actionPlanResponsibleId;
        this.revisionResponsibleId = revisionResponsibleId;
        this.idTask = idTask;
        this.idCategory = idCategory;
        this.idArea = idArea;
    }
}

export default FullMaintenanceDataDTO;
