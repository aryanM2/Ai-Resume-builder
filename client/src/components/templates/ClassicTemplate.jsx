import { MailIcon, PhoneIcon, MapPinIcon, LinkIcon, GlobeIcon } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800 leading-normal text-sm">
            {/* Header */}
            <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1">
                            <MailIcon className="size-4" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1">
                            <PhoneIcon className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPinIcon className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1">
                            <LinkIcon className="size-4" />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1">
                            <GlobeIcon className="size-4" />
                            <span className="break-all">{data.personal_info.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-normal">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className="space-y-2">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-3" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-normal whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <ul className="space-y-2">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-4">
                                <div>
                                    <li className="font-semibold text-gray-800 ">{proj.name}</li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className="space-y-2">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-xs text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-4">
                    <h2 className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
                        CORE SKILLS
                    </h2>

                    <div className="flex gap-2 flex-wrap">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700">
                                • {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;