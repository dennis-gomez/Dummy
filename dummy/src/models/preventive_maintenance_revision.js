class PreventiveMaintenanceRevision {
    constructor(id_revision, revision_date, revision_quantity, revision, revision_quantity_failed, revision_observations, id_responsible, id_task) {
        this.id_revision = id_revision;
        this.revision_date = revision_date;
        this.revision_quantity = revision_quantity;
        this.revision = revision;
        this.revision_quantity_failed = revision_quantity_failed;
        this.revision_observations = revision_observations;
        this.id_responsible = id_responsible;
        this.id_task = id_task;
    }
}
export default PreventiveMaintenanceRevision;
