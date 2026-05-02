 import { PropertyGallery } from "../components/imoveis/PropertyGallery";
import { PropertyMap } from "../components/imoveis/PropertyMap";
import { PropertyNegotiation } from "../components/imoveis/PropertyNegotiation";
import { PropertyVisits } from "../components/imoveis/PropertyVisits";
import { negotiations, property, visits } from "../components/data/properties";

export function Properties() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5">
      <section className="space-y-5">
        <PropertyGallery property={property} />
        <PropertyNegotiation negotiations={negotiations} />
      </section>

      <aside className="space-y-5">
        <PropertyMap />
        <PropertyVisits visits={visits} />
      </aside>
    </div>
  );
}