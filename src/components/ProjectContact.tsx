import { ArrowUpRight, Camera, Mail } from 'lucide-react';
import { projectEmailHref, projectMaterials } from '../data/project-materials';

export function ContactLinks({ subject }: { subject?: string }) {
  return (
    <div className="project-contact-links">
      <a className="button" href={projectEmailHref(subject)}>
        <Mail size={18} />
        <span>{projectMaterials.email}</span>
        <ArrowUpRight size={16} />
      </a>
      <a
        className="button button-outline"
        href={projectMaterials.instagram}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Camera size={18} />
        <span>@jacsdestinos</span>
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

export function ProjectContact() {
  return (
    <section
      className="section project-contact"
      id="contacto"
      aria-labelledby="project-contact-title"
    >
      <div>
        <span className="eyebrow blue">Contacto · JACS Destinos</span>
        <h2 id="project-contact-title">
          Conversemos sobre <em>tu proyecto.</em>
        </h2>
        <p>
          Escríbenos para conocer la propuesta fotográfica, conversar sobre turismo cultural o
          compartir una iniciativa relacionada con Apurímac.
        </p>
      </div>
      <ContactLinks />
    </section>
  );
}
