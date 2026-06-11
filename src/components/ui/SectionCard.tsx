type Resume = {
  workExperience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  // contacts:any[];
  other: any[];
};

interface Props {
  resume: Resume | null;
}

export default function SectionCard({ resume }: Props) {
  if (!resume) return null;

  const normalizedSkills = getSkillList(resume.skills);

  return (
    <div className="space-y-8">

      {/* Work Experience */}
      {resume.workExperience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Work Experience</h2>

          <div className="space-y-4">
            {resume.workExperience.map((job, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-lg">
                    {job.title}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {job.years}
                  </span>
                </div>

                <p className="font-medium text-accent">
                  {job.company}
                </p>

                {/* <p className="mt-2 text-sm whitespace-pre-line">
                  {job.description}
                </p> */}
                {job.description?.length>0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {toBulletPoints(job.description).map(
                      (point, index) => (
                        <li key={index}>{point}</li>
                      )
                    )}
                  </ul>
                )}
                
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Education</h2>

          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white"
              >
                <h3 className="font-semibold">
                  {edu.degree}
                </h3>

                <p>{edu.university}</p>

                <div className="text-sm text-gray-500 mt-1">
                  {edu.years}
                </div>

                {edu.cgpa && (
                  <div className="mt-1">
                    CGPA: {edu.cgpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {normalizedSkills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Skills</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {normalizedSkills.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                {/* <h3 className="font-semibold mb-2">{skill.category}</h3> */}
                <h3 className="font-semibold mb-2">{getSkillTitle(skill)}</h3>

                <div className="flex flex-wrap gap-2">
                  {skill.list.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Projects</h2>

          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white"
              >
                <h3 className="font-semibold text-lg">
                  {project.name}
                </h3>

                <p className="text-accent mt-1">
                  {project.technologies}
                </p>

                {/* <p className="mt-2 text-sm">
                  {project.description}
                </p> */}
                {/* bullet point */}
                {project.description?.length>0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {toBulletPoints(project.description).map(
                      (point, index) => (
                        <li key={index}>{point}</li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Certifications</h2>

          <div className="space-y-2">
            {resume.certifications.map(
              (cert, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-white"
                >
                  {typeof cert === "string"
                    ? cert
                    : JSON.stringify(cert.name)}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Other */}
      {resume.other?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-reversed">Other</h2>

          <div className="space-y-4">
            {resume.other.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white"
              >
                <h3 className="font-semibold mb-2">
                  {item.category}
                </h3>

                <ul className="list-disc list-inside space-y-1">
                  {item.list?.map(
                    (text: string, i: number) => (
                      <li key={i}>{text}</li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

const toBulletPoints = (text: string) => {
  return text
    .split(". ")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item =>
      item.endsWith(".") ? item : item + "."
    );
};
// consider every subdata scenario for 'skill' section
function getSkillList(skills: any[] = []) {
  return skills.map((skill) => {
    const list =
      skill.list ??
      skill.items ??
      skill.keywords ??
      skill.keyword ??
      [];

    return {
      category: skill.category ?? "Other",
      list: Array.isArray(list)
        ? list
        : typeof list === "string"
        ? [list]
        : [],
    };
  });
}
function getSkillTitle(skill: any): string {
  return skill.category ?? skill.name ?? "Unknown";
}