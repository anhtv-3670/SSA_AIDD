// Authoritative node data — mms_D.1_Top talent instance (313:8467):
// Outer: col, gap 80px, width 856px
// Frame 506 (I313:8467;214:2803): row, gap 40px, width 856px, height 550px
//   mms_D.1.1_Picture-Award: 336×336px circle, box-shadow 0 4px 4px rgba(0,0,0,.25) 0 0 6px #FAE287
//     border: 0.955px solid #FFEA9E, mix-blend-mode screen
//   mms_D.1.2_Content: col, gap 32px, backdrop-filter blur(32px)
//     title row: icon + Montserrat 700 24px #FFEA9E
//     description: Montserrat 700 16px white letterSpacing 0.5px justified
//     divider: 1px rgba(46,57,64,1)
//     "Số lượng giải thưởng:" + quantity
//     divider
//     "Giá trị giải thưởng:" + prizeValue
// Rectangle 14: 1px divider at bottom of each card block
//
// Layout alternates by index: odd (0,2,4) medallion LEFT; even (1,3,5) medallion RIGHT.
// Matches D.1/D.3/D.5 (componentId 214:2554) vs D.2/D.4/D.6 (componentId 214:2646).

import type { AwardDetail } from "./award-data";
import { AwardMedallion } from "./award-medallion";
import { AwardContent } from "./award-content";

interface AwardDetailCardProps extends AwardDetail {
  /** 0-based index — drives medallion left/right alternation */
  index: number;
}

export function AwardDetailCard({
  id,
  name,
  description,
  quantity,
  prizeValue,
  ringColor,
  image,
  index,
}: AwardDetailCardProps) {
  // Odd index (0, 2, 4) → medallion left; even index (1, 3, 5) → medallion right
  const medallionRight = index % 2 !== 0;

  return (
    <section
      id={`award-${id}`}
      // EC-7: scroll-margin-top offsets the sticky header so section heading stays visible
      style={{ scrollMarginTop: "80px" }}
      aria-labelledby={`award-title-${id}`}
    >
      {/* Row: medallion + content, gap 40px per Frame 506 */}
      <div
        style={{
          display: "flex",
          flexDirection: medallionRight ? "row-reverse" : "row",
          gap: "40px",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <AwardMedallion name={name} ringColor={ringColor} image={image} />
        <AwardContent
          name={name}
          description={description}
          quantity={quantity}
          prizeValue={prizeValue}
          headingId={`award-title-${id}`}
        />
      </div>

      {/* Bottom separator — Rectangle 14: 1px rgba(46,57,64,1) */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid rgba(46,57,64,1)",
          margin: "80px 0 0",
        }}
      />
    </section>
  );
}
