import { BadgeCheck, BookOpen, Globe, GraduationCap } from "lucide-react";
import type { SVGProps } from "react";
import type { SocialIcon } from "@/lib/schema";

/**
 * lucide-react dropped brand marks in v1, so the one brand glyph the site needs
 * is inlined here. Sized and coloured like a lucide icon (currentColor, square).
 */
export function LinkedInIcon({
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** The glyph for a social link, chosen by the icon stored on the entry. */
export function SocialGlyph({
  icon,
  size = 17,
  className,
}: {
  icon: SocialIcon;
  size?: number;
  className?: string;
}) {
  const shared = { size, className, "aria-hidden": true } as const;

  switch (icon) {
    case "linkedin":
      return <LinkedInIcon size={size} className={className} />;
    case "scholar":
      return <GraduationCap {...shared} />;
    case "orcid":
      return <BadgeCheck {...shared} />;
    case "researchgate":
      return <BookOpen {...shared} />;
    case "website":
    default:
      return <Globe {...shared} />;
  }
}
