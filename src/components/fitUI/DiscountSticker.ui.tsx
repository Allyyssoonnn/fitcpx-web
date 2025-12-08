type DiscountStickerProps = {
   value: number;
};

export function DiscountSticker({ value }: DiscountStickerProps) {
   return (
      <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-sm">
         {/* Fundo orgânico */}
         <path
            d="M10 8
           C6 14, 6 50, 12 56
           C18 62, 46 60, 52 54
           C60 46, 58 16, 50 10
           C42 4, 16 4, 10 8 Z"
            fill="#E6F7EF"
            stroke="#3BB77E"
            strokeWidth="2"
         />

         {/* Texto */}
         <text
            x="32"
            y="36"
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fill="#1F8A5B"
            fontFamily="system-ui, sans-serif"
         >
            {value}%
         </text>

         <text
            x="32"
            y="50"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#1F8A5B"
            fontFamily="system-ui, sans-serif"
         >
            OFF
         </text>
      </svg>
   );
}
