import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800 text-sm">
            <div className="grid grid-cols-3">

                <div className="col-span-1  py-6">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto" style={{ background: accentColor + '70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}
                </div>

                {/* Name + Title */}
                <div className="col-span-2 flex flex-col justify-center py-6 px-6">
                    <h1 className="text-2xl font-bold text-zinc-700 tracking-widest">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="uppercase text-zinc-600 font-medium text-xs tracking-widest">
                        {data?.personal_info?.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-4 pt-0">


                    {/* Contact */}
                    <section className="mb-4">
                        <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-2">
                            CONTACT
                        </h2>
                        <div className="space-y-1 text-xs">
                            {data.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                    <PhoneIcon size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                    <MailIcon size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPinIcon size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-4">
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-2">
                                EDUCATION
                            </h2>
                            <div className="space-y-2 text-xs">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-xs text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-2">
                                SKILLS
                            </h2>
                            <ul className="space-y-1 text-xs">
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-6 pt-0">

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-4">
                            <h2 className="text-xs font-semibold tracking-widest mb-2" style={{ color: accentColor }} >
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-normal">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-xs font-semibold tracking-widest mb-2" style={{ color: accentColor }} >
                                EXPERIENCE
                            </h2>
                            <div className="space-y-3 mb-4">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-xs mb-1" style={{ color: accentColor }} >
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="list-disc list-inside text-xs text-zinc-700 leading-normal space-y-1">
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>
                            <div className="space-y-2">
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="text-xs font-medium text-zinc-800 mt-2">{project.name}</h3>
                                        <p className="text-xs mb-1" style={{ color: accentColor }} >
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className="list-disc list-inside text-xs text-zinc-700  space-y-1">
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;