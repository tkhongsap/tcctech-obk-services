export const DepartureMarkerTemplate =
  '<div style="width: 20px; height: 20px; background-color: white; border: 2px solid black; border-radius: 50%;"></div>';

export const MarkerTemplate = (
  name: string,
  imageUrl?: string | ArrayBuffer,
) => `<View id="promotion" style="position: relative; width: 20px">
		<View style="position: absolute; left: 0; top: -94px; text-align: center;">
			<p
				style="
				text-align: center;
				white-space: nowrap;
				color: #BF0000;
				font-size: 14px;
				font-weight: bold;
				font-family: sans-serif;
				text-shadow:  -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF;;
				"
			>
			${name}
			</p>
		</View>
		<View id="pin" style="position: absolute; left: -5px; top: -56px; border-radius: 50% 50% 50% 0; border: 2px solid white; background-color: #BF0000; width: 50px; height: 50px; transform: rotate(-45deg);" />
		<View style="position: absolute; left: 2px; top: 4px; border-radius: 50% 50% 50% 50%; background-color: #FFFFFF; border: 2px solid white; width: 40px; height: 40px; transform: rotate(45deg);">
			<image src="${imageUrl}" 
			style="position: absolute;
			left: 1px;
			top: -1px;
			width: 38px;
			height: 38px;
			border-radius: 50%;"
			/>
		</View>	
</View>`;

export const DummyMarkerTemplate = (rotation: number) =>
  `
<style>
:root {
  --global-marker-rotation: ${rotation}deg;
}
</style>
<div>&nbsp;</div>`;

export const MarkerIcon = (icon: string, color: string = 'white') => {
  let iconClass = icon.replace(
    /(?<=<svg\b[^<>]*)\s*\bfill=(["']).*?\1/,
    ` fill="${color}"`,
  );
  iconClass = icon.replace(
    /(?<=<path\b[^<>]*)\s*\bfill=(["']).*?\1/,
    ` fill="${color}"`,
  );
  return `${iconClass}`;
};

export const ArrowIcon = `
    <style>
  .mappedin-marker {transition: none} </style>
  <View style="position: relative; transform: rotate(var(--global-marker-rotation, 0deg));">
	<View style="
			position: absolute;
			transform: rotate(300deg);
			left: -48px;
			top: -64px;
			">
			<svg width="72" height="54" viewBox="0 0 72 54" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_f_5_6286)">
			<path d="M0.966534 52.6961L70.7827 41.9438L49.2103 1.09718L0.966534 52.6961Z" fill="url(#paint0_linear_5_6286)"/>
			</g>
			<defs>
			<filter id="filter0_f_5_6286" x="0.146267" y="0.276882" width="71.4567" height="53.2394" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
			<feFlood flood-opacity="0" result="BackgroundImageFix"/>
			<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
			<feGaussianBlur stdDeviation="0.410143" result="effect1_foregroundBlur_5_6286"/>
			</filter>
			<linearGradient id="paint0_linear_5_6286" x1="79.6731" y1="11.1286" x2="0.966534" y2="52.6961" gradientUnits="userSpaceOnUse">
			<stop offset="0.325" stop-color="#EAE9E9" stop-opacity="0.2"/>
			<stop offset="0.81" stop-color="#B7C4E6"/>
			</linearGradient>
			</defs>
			</svg>
	</View>
	<View style="
		position: absolute;
		left: -24px;
		top: -20px;
		">
		<svg
   width="40"
   height="40"
   viewBox="0 0 40 40"
   fill="none"
   version="1.1"
   id="svg5"
   sodipodi:docname="Test.svg"
   inkscape:version="1.4 (e7c3feb1, 2024-10-09)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview5"
     pagecolor="#505050"
     bordercolor="#eeeeee"
     borderopacity="1"
     inkscape:showpageshadow="0"
     inkscape:pageopacity="0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#505050"
     inkscape:zoom="24.125882"
     inkscape:cx="15.419125"
     inkscape:cy="19.833472"
     inkscape:window-width="2560"
     inkscape:window-height="1328"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="1"
     inkscape:current-layer="g3" />
  <g
     filter="url(#filter0_d_63_3712)"
     id="g3">
    <mask
       id="path-1-outside-1_63_3712"
       maskUnits="userSpaceOnUse"
       x="-0.446972"
       y="-7.12835"
       width="38.2177"
       height="38.9252"
       fill="#000000">
      <rect
         fill="#ffffff"
         x="-0.44697201"
         y="-7.1283498"
         width="38.217701"
         height="38.925201"
         id="rect1" />
      <path
         d="m 14.7036,23.1561 c -0.105,0.4297 -0.1112,0.8061 -0.0186,1.1294 0.1019,0.3258 0.2688,0.5944 0.5009,0.8057 0.2438,0.2046 0.5226,0.3339 0.8365,0.3881 0.3232,0.0566 0.6443,0.0281 0.9632,-0.0856 0.319,-0.1137 0.6106,-0.3292 0.8746,-0.6467 L 34.1373,5.24997 C 34.4919,4.81744 34.7052,4.39191 34.7774,3.97339 34.8614,3.54806 34.814,3.16721 34.6353,2.83083 34.4684,2.48764 34.1928,2.23477 33.8084,2.07222 33.424,1.90966 32.9454,1.87613 32.3725,1.97163 L 7.48497,6.34314 C 7.03598,6.42202 6.67082,6.57807 6.3895,6.81127 6.10139,7.03271 5.90116,7.29756 5.78882,7.60583 5.6672,7.91162 5.63877,8.22244 5.70352,8.53829 5.75899,8.85166 5.90241,9.13383 6.13378,9.38481 6.36764,9.62649 6.69351,9.80324 7.11138,9.91505 L 17.1747,12.6375 c 0.1857,0.0497 0.2537,0.1674 0.204,0.3531 z"
         id="path1" />
    </mask>
    <path
       d="m 24.991071,30.60977 c 0.320465,0.307587 0.64437,0.502497 0.971886,0.584833 0.334373,0.07551 0.651777,0.06575 0.952225,-0.02952 0.30052,-0.108801 0.553241,-0.285926 0.758384,-0.531359 0.211907,-0.252311 0.348833,-0.545636 0.410615,-0.879956 0.06184,-0.334406 0.02143,-0.696264 -0.121495,-1.085501 L 19.218932,4.7092114 C 19.021686,4.1833393 18.759373,3.7837578 18.432106,3.510296 18.104863,3.2231555 17.750108,3.0725663 17.367871,3.058458 16.985659,3.0306643 16.62719,3.1427893 16.292411,3.3949186 15.957622,3.6470451 15.687508,4.0459826 15.482016,4.591819 L 6.7488174,28.415904 c -0.1575413,0.429813 -0.205824,0.825648 -0.1448632,1.187486 0.047325,0.361817 0.176615,0.669138 0.387883,0.921961 0.2044418,0.259637 0.4601748,0.440841 0.7671966,0.543624 0.3001927,0.109594 0.6175646,0.127063 0.9521212,0.05241 0.32773,-0.08149 0.6453771,-0.275622 0.9529259,-0.58238 l 7.4323861,-7.372488 c 0.136678,-0.136322 0.273184,-0.136133 0.409501,5.34e-4 z"
       fill="#000000"
       id="path2"
       style="stroke-width:1.00418" />
    <path
       d="m 14.7036,23.1561 -1.5937,-0.3895 0.0034,-0.014 0.0037,-0.014 z m -0.0186,1.1294 -1.5658,0.4898 -0.0059,-0.0189 -0.0055,-0.0191 z m 0.5009,0.8057 -1.0545,1.2569 -0.0256,-0.0215 -0.0247,-0.0225 z m 0.8365,0.3881 0.2788,-1.6168 0.0043,8e-4 z m 1.8378,-0.7323 -1.2613,-1.0491 0.0019,-0.0023 z M 34.1373,5.24997 35.4061,6.29001 35.4014,6.29571 35.3967,6.30137 Z M 34.7774,3.97339 33.1607,3.69457 33.1641,3.67509 33.1679,3.65571 Z M 34.6353,2.83083 33.1865,3.6004 33.1728,3.5746 33.16,3.54833 Z M 32.3725,1.97163 32.0887,0.355797 32.0957,0.354564 32.1028,0.353392 Z M 7.48497,6.34314 7.20109,4.72731 l 6e-5,-1e-5 z M 6.38951,6.81127 7.43653,8.0743 7.41323,8.09361 7.38923,8.11205 Z M 5.78882,7.60584 7.33024,8.16753 7.32207,8.18996 7.31325,8.21215 Z M 5.70352,8.5383 7.31067,8.20882 7.31512,8.23053 7.31898,8.25236 Z M 6.13378,9.38481 4.95478,10.5256 4.94101,10.5114 4.92758,10.4968 Z M 7.11138,9.91505 7.53542,8.33022 7.5398,8.33141 Z m 10.06332,2.72245 -0.4241,1.5848 -0.0044,-0.0012 z m 0.204,0.3531 -1.5866,-0.4175 0.0018,-0.0065 z m -2.6751,10.1655 1.5936,0.3895 c -0.058,0.2373 -0.0282,0.3123 -0.0351,0.2882 l -1.5771,0.4517 -1.5772,0.4518 c -0.1921,-0.6707 -0.1499,-1.3487 0.0021,-1.9707 z m -0.0186,1.1294 1.5657,-0.4897 c 0.0129,0.0411 0.0244,0.0617 0.0292,0.0693 0.0043,0.007 0.0072,0.0101 0.0107,0.0133 l -1.1047,1.2128 -1.1048,1.2129 c -0.4657,-0.4242 -0.781,-0.9505 -0.9619,-1.5288 z m 0.5009,0.8057 1.0544,-1.2568 c 0.0214,0.018 0.0326,0.0233 0.0609,0.0282 l -0.2788,1.6167 -0.2788,1.6167 c -0.5995,-0.1034 -1.146,-0.3568 -1.6122,-0.7479 z m 0.8365,0.3881 0.2831,-1.616 c 0.0346,0.0061 0.0687,0.0067 0.1295,-0.015 l 0.5506,1.5454 0.5507,1.5454 c -0.5772,0.2057 -1.1853,0.2633 -1.797,0.1561 z m 0.9632,-0.0856 -0.5506,-1.5454 c -0.013,0.0046 0.0468,-0.0096 0.1639,-0.1504 l 1.2613,1.0491 1.2613,1.0492 c -0.411,0.494 -0.9342,0.9109 -1.5852,1.1429 z M 17.8602,24.747 16.6008,23.6956 32.8779,4.19858 34.1373,5.24997 35.3967,6.30137 19.1196,25.7984 Z M 34.1373,5.24997 32.8685,4.20994 c 0.23,-0.28054 0.2812,-0.45128 0.2922,-0.51537 l 1.6167,0.27882 1.6167,0.27882 c -0.1333,0.77296 -0.5088,1.45327 -0.988,2.0378 z M 34.7774,3.97339 33.1679,3.65571 c 0.0125,-0.06328 0.0085,-0.08818 0.0089,-0.08451 2e-4,0.00135 10e-4,0.0063 0.0032,0.01336 0.0022,0.00707 0.0048,0.01266 0.0065,0.01584 l 1.4488,-0.76957 1.4489,-0.76958 c 0.3799,0.71513 0.4491,1.4884 0.3027,2.22982 z M 34.6353,2.83083 33.16,3.54833 c 0.0015,0.00318 0.0055,0.01053 0.0126,0.02002 0.0071,0.00954 0.0148,0.01791 0.0218,0.02437 0.0069,0.00635 0.0104,0.00832 0.008,0.0068 -0.0026,-0.00164 -0.0127,-0.00771 -0.033,-0.01629 l 0.639,-1.51101 0.639,-1.511016 c 0.7131,0.30155 1.306,0.817476 1.6633,1.552116 z M 33.8084,2.07222 33.1694,3.58323 C 33.1631,3.58057 33.0236,3.5263 32.6423,3.58987 L 32.3725,1.97163 32.1028,0.353392 c 0.7643,-0.127426 1.5821,-0.114637 2.3446,0.207812 z M 32.3725,1.97163 32.6564,3.58747 7.76879,7.95897 7.48497,6.34314 7.20115,4.7273 32.0887,0.355797 Z M 7.48497,6.34314 7.76885,7.95896 C 7.53193,8.00059 7.45038,8.06281 7.43653,8.0743 L 6.38951,6.81127 5.34248,5.54825 C 5.89126,5.09332 6.54002,4.84345 7.20109,4.72731 Z M 6.38951,6.81127 7.38923,8.11205 C 7.35075,8.14163 7.33555,8.16056 7.33193,8.16534 7.32988,8.16806 7.32949,8.16894 7.32986,8.16826 c 3.8e-4,-7e-4 5.5e-4,-0.00118 3.8e-4,-7.3e-4 L 5.78882,7.60584 4.24741,7.04414 C 4.47772,6.41211 4.88205,5.90072 5.38978,5.51049 Z M 5.78882,7.60584 7.31325,8.21215 C 7.31007,8.22014 7.30914,8.22399 7.30913,8.22404 7.3091,8.22414 7.30925,8.22356 7.30945,8.22238 7.30964,8.22119 7.30986,8.21962 7.31003,8.21775 7.3104,8.21376 7.31041,8.21009 7.31025,8.20743 7.3101,8.20483 7.3099,8.2051 7.31067,8.20882 L 5.70352,8.5383 4.09637,8.86777 C 3.96599,8.23179 4.02717,7.59599 4.2644,6.99952 Z M 5.70352,8.5383 7.31898,8.25236 C 7.31901,8.25252 7.31868,8.25074 7.3177,8.2478 7.31671,8.24484 7.3157,8.2426 7.31518,8.2416 7.3147,8.24064 7.31553,8.24249 7.31886,8.24723 7.32225,8.25205 7.3288,8.26067 7.33998,8.2728 L 6.13378,9.38481 4.92758,10.4968 C 4.49976,10.0328 4.20219,9.46903 4.08806,8.82423 Z M 6.13378,9.38481 7.31278,8.244 C 7.2886,8.21901 7.32404,8.27367 7.53542,8.33023 L 7.11138,9.91505 6.68734,11.4999 C 6.06297,11.3328 5.44668,11.034 4.95478,10.5256 Z M 7.11138,9.91505 7.5398,8.33141 17.6031,11.0538 17.1747,12.6375 16.7462,14.2211 6.68295,11.4987 Z m 10.06332,2.72245 0.424,-1.5848 c 0.3372,0.0902 0.8583,0.3211 1.1868,0.8895 0.3284,0.5685 0.2683,1.1353 0.178,1.4725 l -1.5848,-0.4241 -1.5848,-0.424 c -0.0405,0.1514 -0.1099,0.5665 0.1506,1.0172 0.2605,0.4508 0.6547,0.598 0.8061,0.6385 z m 0.204,0.3531 1.5866,0.4175 -2.6752,10.1655 -1.5865,-0.4175 -1.5866,-0.4175 2.6752,-10.1655 z"
       fill="#ffffff"
       mask="url(#path-1-outside-1_63_3712)"
       id="path3"
       transform="matrix(0.50351663,-0.86882698,0.86882698,0.50351663,-2.5310806,31.725172)"
       sodipodi:nodetypes="ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccscccccccccscccccccccccccccccccccccccccccscccccccccccccccccccccccccccccccccccccccccccccccccccccccc" />
  </g>
  <defs
     id="defs5">
    <filter
       id="filter0_d_63_3712"
       x="0.74815202"
       y="0.278137"
       width="38.991001"
       height="33.432201"
       filterUnits="userSpaceOnUse"
       color-interpolation-filters="sRGB">
      <feFlood
         flood-opacity="0"
         result="BackgroundImageFix"
         id="feFlood3" />
      <feColorMatrix
         in="SourceAlpha"
         type="matrix"
         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
         result="hardAlpha"
         id="feColorMatrix3" />
      <feOffset
         dy="3.28114"
         id="feOffset3" />
      <feGaussianBlur
         stdDeviation="1.64057"
         id="feGaussianBlur3" />
      <feComposite
         in2="hardAlpha"
         operator="out"
         id="feComposite3" />
      <feColorMatrix
         type="matrix"
         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
         id="feColorMatrix4" />
      <feBlend
         mode="normal"
         in2="BackgroundImageFix"
         result="effect1_dropShadow_63_3712"
         id="feBlend4" />
      <feBlend
         mode="normal"
         in="SourceGraphic"
         in2="effect1_dropShadow_63_3712"
         result="shape"
         id="feBlend5" />
    </filter>
  </defs>
</svg>

	</View>
</View>
`;

export const PinMarker = (name: string, imageUrl: string | ArrayBuffer, lang: string) => {
  let startingText = 'Start Here';
  if (lang === 'th') {
    startingText = 'เริ่มต้นที่นี่';
  }
  return `
  	<View style="position: relative;">
	<View style="
			position: absolute;
			left: 28px;
			top: -60px;
			white-space: nowrap;
			color: black;
			font-size: 14px;
			font-weight: bold;
			font-family: sans-serif;
			text-shadow:  -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF;
			z-index: 60;
			">
		<p style="
			width: 80px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;"
			>
				${name}
		</p>
	</View>
	<p
		style="
		position: absolute;
		left: -22px;
		top: -96px;
		white-space: nowrap;
		color: white;
		font-size: 11px;
		font-weight: bold;
		font-family: sans-serif;
		z-index: 60;
		"
		>
		${startingText}	
	</p>
	<View style="position: absolute; top: -89px; left: -36px;">
	<svg width="153" height="96" viewBox="0 0 153 96" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g filter="url(#filter0_d_1031_734)">
		<rect x="4" width="72" height="21" rx="10.5" fill="black"/>
		</g>
		<g filter="url(#filter1_d_1031_734)">
		<rect x="19" y="28" width="130" height="42" rx="21" fill="white"/>
		<rect x="19.5" y="28.5" width="129" height="41" rx="20.5" stroke="white"/>
		</g>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M40 28C51.598 28 61 37.402 61 49C61 59.9234 52.6599 68.8989 42 69.906V92C42 93.1046 41.1046 94 40 94C38.8954 94 38 93.1046 38 92V69.906C27.3401 68.8989 19 59.9234 19 49C19 37.402 28.402 28 40 28Z" fill="black"/>
		<circle cx="40" cy="49" r="17" fill="white"/>
		<circle cx="40" cy="49" r="12" fill="black"/>
		<path opacity="0.3" d="M40 96C42.7614 96 45 94.8807 45 93.5C45 92.1193 42.7614 91 40 91C37.2386 91 35 92.1193 35 93.5C35 94.8807 37.2386 96 40 96Z" fill="black"/>
		<rect x="20.5" y="30.5" width="39" height="39" rx="19.5" fill="white" stroke="black" stroke-width="3"/>
		<g filter="url(#filter2_d_1031_734)">
		<rect x="22" y="32" width="36" height="36" rx="18" fill="url(#pattern0_1031_734)" shape-rendering="crispEdges"/>
		</g>
		<defs>
		<filter id="filter0_d_1031_734" x="0" y="0" width="80" height="29" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
		<feFlood flood-opacity="0" result="BackgroundImageFix"/>
		<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
		<feOffset dy="4"/>
		<feGaussianBlur stdDeviation="2"/>
		<feComposite in2="hardAlpha" operator="out"/>
		<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
		<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1031_734"/>
		<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1031_734" result="shape"/>
		</filter>
		<filter id="filter1_d_1031_734" x="15" y="28" width="138" height="50" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
		<feFlood flood-opacity="0" result="BackgroundImageFix"/>
		<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
		<feOffset dy="4"/>
		<feGaussianBlur stdDeviation="2"/>
		<feComposite in2="hardAlpha" operator="out"/>
		<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
		<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1031_734"/>
		<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1031_734" result="shape"/>
		</filter>
		<filter id="filter2_d_1031_734" x="18" y="32" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
		<feFlood flood-opacity="0" result="BackgroundImageFix"/>
		<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
		<feOffset dy="4"/>
		<feGaussianBlur stdDeviation="2"/>
		<feComposite in2="hardAlpha" operator="out"/>
		<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
		<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1031_734"/>
		<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1031_734" result="shape"/>
		</filter>
		<pattern id="pattern0_1031_734" patternContentUnits="objectBoundingBox" width="1" height="1">
		<use xlink:href="#image0_1031_734" transform="scale(0.00166667)"/>
		</pattern>
		</defs>
	</svg>
	</View>
	<View>
  		<image src="${imageUrl}" 
		style="position: absolute;
		left: -14px;
		top: -57px;
		width: 36px;
		height: 36px;
		border-radius: 50%;"
		/>
	</View>
	</View>
`;
};

export const MarkerAmenityTemplate = (
  name: string,
  color: string,
  icon: string,
  size?: number,
) => `<div id="promotion" style="position: relative; display: flex; flex-direction: column;">
		<p
			style="
			text-align: center;
			left: 0;
			top: -76px;
			white-space: nowrap;
			color: ${color};
			font-size: 14px;
			font-weight: bold;
			font-family: sans-serif;
			text-shadow:  -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF;;
			"
		>
			${name}
		</p> 
		<div style="border-radius: 50% 50% 50% 0; border: 2px solid ${color}; background-color: ${color}; 
		width: ${size ?? 44}px; height: ${
  size ?? 44
}px; transform: rotate(-45deg); display: flex; justify-content: center; margin: auto;">
			<div class="img-wrapper" style="
				margin: auto;
				background-color: ${color};
				align-items: center;
				width: 70%;
				height: 70%;
				transform: rotate(45deg);
				margin-right: 7px;
				margin-top: 5px;
				border-radius: 50%;">
			<div style="
				border-radius: 50%; 
				background-color: white; 
				border: 2px solid white; 
				width: 100%; 
				height: 100%; 
				display: flex;
				justify-content: center;">
				${
          icon
            ? `<image src="${icon}" 
				style="
				width: 100%;
				height: 100%;
				background-color: white;
				border-radius: 50%;" 
				/>`
            : '<div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>'
        }
		</div>
			</div>
		</div>
</div>`;
