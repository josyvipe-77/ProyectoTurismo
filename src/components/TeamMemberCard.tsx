import { useState } from 'react';

export interface ConsultantMember {
  name: string;
  portrait?: string;
  contribution?: string;
  phrase?: string;
}

export function TeamMemberCard({ member }: { member: ConsultantMember }) {
  const [failedPortrait, setFailedPortrait] = useState<string | null>(null);
  const initials = member.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
  return (
    <li className="team-member-card">
      <div className="member-portrait">
        {member.portrait && failedPortrait !== member.portrait ? (
          <img
            src={member.portrait}
            alt={`Retrato de ${member.name}`}
            loading="lazy"
            onError={() => setFailedPortrait(member.portrait ?? null)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
      <div className="member-profile">
        <h4>{member.name}</h4>
        <span className="member-contribution">{member.contribution ?? 'Equipo consultor'}</span>
        {member.phrase && <p className="member-phrase">{member.phrase}</p>}
      </div>
    </li>
  );
}
