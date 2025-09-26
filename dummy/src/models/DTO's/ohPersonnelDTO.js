class OccupationalHealthPersonnelDTO {
  constructor(
    cod_personnel,
    oh_personnel_UID,
    oh_personnel_full_name,
    oh_personnel_brigade_service_cod,
    oh_personnel_brigade_category_code,
    oh_personnel_brigade_item_code,
    item_name,
    oh_personnel_is_active
  ) {
    this.cod_personnel = cod_personnel;
    this.oh_personnel_UID = oh_personnel_UID;
    this.oh_personnel_full_name = oh_personnel_full_name;
    this.oh_personnel_brigade_service_cod = oh_personnel_brigade_service_cod;
    this.oh_personnel_brigade_category_code = oh_personnel_brigade_category_code;
    this.oh_personnel_brigade_item_code = oh_personnel_brigade_item_code;
    this.item_name = item_name;
    this.oh_personnel_is_active = oh_personnel_is_active;
  }
}

export default OccupationalHealthPersonnelDTO;
