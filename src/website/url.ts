import { isIP } from 'node:net';
export function publicAddress(address:string):boolean {
 if(isIP(address)===4){const [a=0,b=0]=address.split('.').map(Number);return a!==0&&a!==10&&a!==127&&!(a===169&&b===254)&&!(a===192&&(b===168||b===0||b===2))&&!(a===172&&b>=16&&b<=31)&&!(a===100&&b>=64&&b<=127)&&a<224&&!(a===198&&(b===18||b===19||b===51))&&!(a===203&&b===0);}
 return isIP(address)===6&&/^[23][0-9a-f]{3}:/i.test(address)&&!address.toLowerCase().startsWith('2001:db8:');
}
export function websiteUrl(value:string):URL {const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Enter a public HTTP or HTTPS URL without credentials.');return url;}
