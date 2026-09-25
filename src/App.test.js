import {
  buildProductSpecs,
  motherboardFitsCase,
} from "./utils/productSpecs";
import { isBestSellerProduct, isNewArrivalProduct } from "./utils/productUtils";

describe("buildProductSpecs", () => {
  test("keeps GPU fields needed for length and VRAM checks", () => {
    const specs = buildProductSpecs({
      category: "gpu",
      length: "304mm",
      vram: "32GB GDDR7",
      wattage: 575,
    });

    expect(specs.length).toBe("304mm");
    expect(specs.vram).toBe("32GB GDDR7");
    expect(specs.tdp).toBe("575W");
  });

  test("keeps case clearance and socket metadata for compatibility logic", () => {
    const specs = buildProductSpecs({
      category: "case",
      gpuClearance: "420mm",
    });

    expect(specs.gpuClearance).toBe("420mm");

    const coolerSpecs = buildProductSpecs({
      category: "cooler",
      sockets: "AM5, LGA1700",
    });

    expect(coolerSpecs.sockets).toEqual(["AM5", "LGA1700"]);
  });

  test("supports motherboard, RAM, storage, and PSU fields", () => {
    const motherboardSpecs = buildProductSpecs({
      category: "motherboard",
      socket: "AM5",
      formFactor: "ATX",
    });

    const ramSpecs = buildProductSpecs({
      category: "ram",
      speed: "DDR5-6000",
      capacity: "32GB",
    });

    const storageSpecs = buildProductSpecs({
      category: "storage",
      capacity: "2TB",
      interface: "PCIe 4.0",
    });

    const psuSpecs = buildProductSpecs({
      category: "psu",
      wattage: 1000,
      efficiency: "80+ Gold",
    });

    expect(motherboardSpecs.socket).toBe("AM5");
    expect(motherboardSpecs.formFactor).toBe("ATX");
    expect(ramSpecs.speed).toBe("DDR5-6000");
    expect(storageSpecs.capacity).toBe("2TB");
    expect(psuSpecs.wattage).toBe("1000W");
    expect(psuSpecs.efficiency).toBe("80+ Gold");
  });

  test("keeps board fit validation consistent across ATX, Micro-ATX, and Mini-ITX cases", () => {
    expect(
      motherboardFitsCase(
        { specs: { formFactor: "ATX" } },
        { specs: { formFactor: "ATX" } },
      ),
    ).toBe(true);
    expect(
      motherboardFitsCase(
        { specs: { formFactor: "ATX" } },
        { specs: { formFactor: "Micro-ATX" } },
      ),
    ).toBe(false);
    expect(
      motherboardFitsCase(
        { specs: { formFactor: "Micro-ATX" } },
        { specs: { formFactor: "ATX" } },
      ),
    ).toBe(true);
    expect(
      motherboardFitsCase(
        { specs: { formFactor: "Mini-ITX" } },
        { specs: { formFactor: "ATX" } },
      ),
    ).toBe(true);
  });

  test("flags recent products as new arrivals while older items stay hidden", () => {
    const recent = {
      id: "gpu-new",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isNewArrival: true,
    };
    const oldProduct = {
      id: "gpu-old",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    };

    expect(isNewArrivalProduct(recent)).toBe(true);
    expect(isNewArrivalProduct(oldProduct)).toBe(false);
  });

  test("identifies products as best sellers when they are popular or highly rated", () => {
    expect(isBestSellerProduct({ isPopular: true })).toBe(true);
    expect(isBestSellerProduct({ rating: 4.9 })).toBe(true);
    expect(isBestSellerProduct({ performanceScore: 92 })).toBe(true);
    expect(isBestSellerProduct({ rating: 3.4 })).toBe(false);
  });
});
