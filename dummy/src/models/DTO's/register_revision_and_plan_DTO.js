class RegisterRevisionAndPlanDTO {
    constructor({
        revisionDate,
        revisionQuantity,
        revision,
        revisionQuantityFailed = null,
        revisionObservations = null,
        idResponsible,
        idTask,
        followUpDate,
        maintenanceDetails = null,
        actionPlanDate = null,
        idResponsiblePlan = null,
        createActionPlan = false
    }) {
        this.revisionDate = revisionDate;                  // DATE
        this.revisionQuantity = revisionQuantity;          // INT
        this.revision = revision;                          // BIT / boolean
        this.revisionQuantityFailed = revisionQuantityFailed; // INT | null
        this.revisionObservations = revisionObservations; // VARCHAR(255) | null
        this.idResponsible = idResponsible;               // INT
        this.idTask = idTask;                             // INT
        this.followUpDate = followUpDate;                 // DATE
        this.maintenanceDetails = maintenanceDetails;     // VARCHAR(255) | null
        this.actionPlanDate = actionPlanDate;             // DATE | null
        this.idResponsiblePlan = idResponsiblePlan;       // INT | null
        this.createActionPlan = createActionPlan;         // BIT / boolean
    }
}

export default RegisterRevisionAndPlanDTO;
