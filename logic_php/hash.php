<?php

use Dom\CharacterData;

function charCodeAt(string $str, int $index) : int{
	return mb_ord(mb_substr($str, $index, 1, 'UTF-16'), 'UTF-16');
}
function hash(string $plaintext, int $seed = NULL) : string {
		$cipher = "";
		
		$a = 1;
		$b = 0;
		$L = strlen($plaintext);
		$M = 0;
		$c = 0;
		$d = 0;

		if (is_numeric($seed)) {
			$a = $seed & 0xFFFF;
			$b = ($seed >> 16) & 0xFFFF;
		}

		for($i = 0; $i < $L; ){
	   		$M = min($L - $i, 2918);

			while($M > 0){
				$c = charCodeAt($plaintext, $i++);
				
				if($c < 0x80) {
					$a += $c;
				}
				else if($c < 0x800) {
					$a += 192 | (($c >> 6) & 31);
					$b += $a;
					--$M;

					$a += 128 | ($c & 63);
				}
				else if($c >= 0xD800 && $c < 0xE000){
					$c = ($c & 1023) + 64;
					$d = charCodeAt($c, $i++) & 1023;

					$a += 240 | (($c >> 8) & 7);
					$b += $a;
					$M--;

					$a += 128 | (($c >> 2) & 63);
					$b += $a;
					$M--;

					$a += 128 | (($d >> 6) & 15) | (($c & 3) << 4);
					$b += $a;
					$M--;

					$a += 128 | ($d & 63);
				}
				else{
					$a += 224 | (($c >> 12) & 15);
					$b += $a;
					$M--;

					$a += 128 | (($c >> 6) & 63);
					$b += $a;
					$M--;

					$a += 128 | ($c & 63);
				}
            
				$b += $a;
				$M--;
			}

			$a = (15 * ($a >> 16)) + ($a & 65535);
			$b = (15 * ($b >> 16)) + ($b & 65535);
		}

		return (($b % 65521) << 16) | ($a % 65521);
	}

?>