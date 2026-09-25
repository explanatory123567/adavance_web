export const normalizeSocketList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizeFormFactor = (value) => {
  if (value === undefined || value === null) return "";

  const normalized = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace("microatx", "matx")
    .replace("miniitx", "itx")
    .replace("extendedatx", "eatx");

  return normalized;
};

export const motherboardFitsCase = (motherboard, computerCase) => {
  if (!motherboard || !computerCase) return true;

  const boardFactor = normalizeFormFactor(
    motherboard.specs?.formFactor ||
      motherboard.specs?.form_factor ||
      motherboard.formFactor,
  );
  const caseFactors = String(
    computerCase.specs?.formFactor ||
      computerCase.specs?.supportedFormFactors ||
      computerCase.specs?.supportedFormFactor ||
      computerCase.formFactor ||
      "",
  )
    .split(/[\/,&]+/)
    .map((part) => normalizeFormFactor(part))
    .filter(Boolean);

  if (!boardFactor || caseFactors.length === 0) return true;

  const rank = { itx: 1, matx: 2, atx: 3, eatx: 4 };
  const caseRank = caseFactors.reduce(
    (max, factor) => Math.max(max, rank[factor] ?? 0),
    0,
  );

  const boardRank = rank[boardFactor] ?? 0;
  if (boardRank === 0 || caseRank === 0) return true;

  return caseRank >= boardRank;
};

export const buildProductSpecs = (productData = {}) => {
  const {
    category,
    socket,
    sockets,
    gpuClearance,
    length,
    vram,
    capacity,
    speed,
    interface: interfaceType,
    efficiency,
    airflow,
    formFactor,
    wattage,
    tdp,
    ...rest
  } = productData;

  const specs = {};

  const addIfPresent = (key, value) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      specs[key] = value;
    }
  };

  if (category === "cpu") {
    addIfPresent("socket", socket);
    addIfPresent("cores", rest.cores);
    addIfPresent("threads", rest.threads);
    addIfPresent("cache", rest.cache);
    addIfPresent("baseClock", rest.baseClock);
    addIfPresent("boostClock", rest.boostClock);
  }

  if (category === "gpu") {
    addIfPresent("length", length || rest.gpuLength);
    addIfPresent("vram", vram || rest.memory);
    addIfPresent("tdp", tdp || (wattage ? `${wattage}W` : rest.tdp));
    addIfPresent("cooling", rest.cooling);
    addIfPresent("boostClock", rest.boostClock);
  }

  if (category === "motherboard") {
    addIfPresent("socket", socket || rest.socket);
    addIfPresent("formFactor", formFactor || rest.form_factor || rest.formFactor);
    addIfPresent("chipset", rest.chipset);
    addIfPresent("memoryType", rest.memoryType || rest.ramType);
    addIfPresent("slots", rest.slots);
  }

  if (category === "ram") {
    addIfPresent("speed", speed || rest.memorySpeed);
    addIfPresent("capacity", capacity || rest.capacity);
    addIfPresent("type", rest.type || "DDR5");
    addIfPresent("modules", rest.modules);
  }

  if (category === "storage") {
    addIfPresent("capacity", capacity || rest.capacity);
    addIfPresent("interface", interfaceType || rest.interfaceType || rest.connection);
    addIfPresent("type", rest.type || "NVMe");
    addIfPresent("readSpeed", rest.readSpeed);
    addIfPresent("writeSpeed", rest.writeSpeed);
  }

  if (category === "psu") {
    addIfPresent("efficiency", efficiency || rest.efficiency);
    addIfPresent("modular", rest.modular);
    addIfPresent("wattage", wattage ? `${wattage}W` : rest.psuWattage);
  }

  if (category === "case") {
    addIfPresent("gpuClearance", gpuClearance || rest.gpuClearance || rest.caseLength);
    addIfPresent("formFactor", formFactor || rest.formFactor);
    addIfPresent("driveSupport", rest.driveSupport);
    addIfPresent("fanSupport", rest.fanSupport);
    addIfPresent("dimensions", rest.dimensions || rest.size);
  }

  if (category === "cooler") {
    const normalizedSockets = normalizeSocketList(sockets || socket || rest.sockets || rest.socket);
    if (normalizedSockets.length > 0) {
      specs.sockets = normalizedSockets;
    }
    addIfPresent("socket", socket);
    addIfPresent("radiator", rest.radiator || rest.size || rest.coolingType);
    addIfPresent("noiseLevel", rest.noiseLevel);
  }

  if (category === "fans") {
    addIfPresent("airflow", airflow || rest.airflow);
    addIfPresent("size", rest.size || "120mm");
    addIfPresent("rpm", rest.rpm);
  }

  addIfPresent("length", length);
  addIfPresent("vram", vram);
  addIfPresent("speed", speed);
  addIfPresent("capacity", capacity);
  addIfPresent("interface", interfaceType);
  addIfPresent("gpuClearance", gpuClearance);
  addIfPresent("airflow", airflow);
  addIfPresent("formFactor", formFactor);
  addIfPresent("socket", socket);

  if (sockets && !specs.sockets) {
    const normalizedSockets = normalizeSocketList(sockets);
    if (normalizedSockets.length > 0) {
      specs.sockets = normalizedSockets;
    }
  }

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      if (!(key in specs)) {
        specs[key] = value;
      }
    }
  });

  return specs;
};
