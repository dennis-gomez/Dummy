class PreventiveMaintenanceActionPlan {
    constructor(id_action_plan, maintenance_details, action_plan_date, id_responsible, id_revision) {
        this.id_action_plan = id_action_plan;
        this.maintenance_details = maintenance_details;
        this.action_plan_date = action_plan_date;
        this.id_responsible = id_responsible;
        this.id_revision = id_revision;
    }
}
export default PreventiveMaintenanceActionPlan;
