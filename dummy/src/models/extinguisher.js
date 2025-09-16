class Extinguisher {
  constructor(
    cod_extinguisher,
    extinguisher_serial_number,
    extinguisher_brand,
    extinguisher_agent,
    extinguisher_type,
    extinguisher_capacity,
    extinguisher_manufacturing_date,
    extinguisher_installation_date,
    extinguisher_location,
    extinguisher_next_date_inspection = null,
    extinguisher_observations = null
  ) {
    this.cod_extinguisher = cod_extinguisher;
    this.extinguisher_serial_number = extinguisher_serial_number;
    this.extinguisher_brand = extinguisher_brand;
    this.extinguisher_agent = extinguisher_agent;
    this.extinguisher_type = extinguisher_type;
    this.extinguisher_capacity = extinguisher_capacity;
    this.extinguisher_manufacturing_date = extinguisher_manufacturing_date;
    this.extinguisher_installation_date = extinguisher_installation_date;
    this.extinguisher_location = extinguisher_location;
    this.extinguisher_next_date_inspection = extinguisher_next_date_inspection;
    this.extinguisher_observations = extinguisher_observations;
  }
}

export default Extinguisher;
