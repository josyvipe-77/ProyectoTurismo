import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RespectNote, SectionHeading } from '../components/Editorial';
import { TeamMemberCard } from '../components/TeamMemberCard';
import type { ConsultantMember } from '../components/TeamMemberCard';
import { BrandLogo } from '../components/BrandLogo';

const teams: { university: string; country: string; members: ConsultantMember[] }[] = [
  {
    university: 'Universidad Nacional Micaela Bastidas de Apurímac',
    country: 'UNAMBA · Perú',
    members: [{ name: 'Josely Janeth Villacrez Peña' }, { name: 'Jimmy Edilson Vargas Huarcaya' }],
  },
  {
    university: 'Universidad de Santiago de Compostela',
    country: 'USC · España',
    members: [
      { name: 'Carmen Ramos Álvarez' },
      { name: 'Andrea Seoane Pintos' },
      { name: 'Carolina Rey Nogueira' },
    ],
  },
];

export default function ConsultantPage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <BrandLogo className="consultant-logo" />
        <span className="eyebrow blue">Sobre la consultora · COIL USC–UNAMBA</span>
        <h1>
          JACS Destinos.
          <br />
          <em>Miradas que se encuentran.</em>
        </h1>
        <p>
          Un equipo de Perú y España que investiga el territorio y diseña experiencias para conocer
          el paisaje, el patrimonio y las comunidades de Apurímac.
        </p>
      </div>
      <section className="section product-columns">
        <div>
          <span className="eyebrow blue">Nuestro proyecto</span>
          <h2>
            Del diagnóstico
            <br />
            <em>a la experiencia.</em>
          </h2>
        </div>
        <div>
          <p>
            JACS Destinos es la identidad de nuestra consultora académica en el proyecto COIL
            «Aplicación de la Inteligencia Artificial para el Diseño de Productos de Turismo
            Cultural».
          </p>
          <p>
            Nuestro trabajo conecta la caracterización territorial, el diagnóstico turístico y el
            diseño de productos. «Apurímac a través de tu objetivo» es nuestra propuesta
            fotográfica: cinco días de naturaleza, interpretación del patrimonio y participación
            local por coordinar.
          </p>
          <p>
            Este sitio presenta el diseño del producto. La operación, los proveedores y los precios
            siguen en desarrollo.
          </p>
          <Link to="/experiencia" className="text-link">
            Conoce nuestro producto <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          label="Equipo consultor"
          title="Dos universidades, un proyecto compartido"
        />
        <div className="grid-two consultant-teams">
          {teams.map((team) => (
            <article key={team.country}>
              <span className="eyebrow blue">{team.country}</span>
              <h3>{team.university}</h3>
              <ul className="team-member-list">
                {team.members.map((member) => (
                  <TeamMemberCard key={member.name} member={member} />
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section product-columns">
        <div>
          <span className="eyebrow blue">Aprendizaje Galicia–Apurímac</span>
          <h2>
            Compartir criterios.
            <br />
            <em>Respetar cada territorio.</em>
          </h2>
        </div>
        <div>
          <p>
            La comparación entre Galicia y Apurímac nos permite proponer criterios comunes:
            interpretar el paisaje junto con su historia, dar espacio a las voces locales y vincular
            las visitas con servicios de la comunidad.
          </p>
          <p>
            En Apurímac esos criterios se adaptan a los recorridos de montaña, la altitud, los
            ecosistemas y las condiciones de acceso. El puente de Pachachaca y los entornos de
            Abancay y Tamburco ayudan a conectar naturaleza y patrimonio cultural.
          </p>
          <p>
            La propuesta busca favorecer la contratación local y una fotografía respetuosa. Los
            beneficios deberán evaluarse con actores del territorio; no se presentan como impactos
            ya logrados.
          </p>
        </div>
      </section>
      <RespectNote />
    </div>
  );
}
