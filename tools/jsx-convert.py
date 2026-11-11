import json,sys,re
from pathlib import Path
from html.parser import HTMLParser
class JSX(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.out=[]
    def handle_starttag(self,tag,attrs):
        out='<'+tag
        aliases={'class':'className','for':'htmlFor','tabindex':'tabIndex','viewbox':'viewBox','pathlength':'pathLength','stroke-dasharray':'strokeDasharray','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','readonly':'readOnly','maxlength':'maxLength','colspan':'colSpan','rowspan':'rowSpan','autofocus':'autoFocus'}
        for key,value in attrs:
            key=aliases.get(key,key)
            if key=='style':
                styles={}
                for part in value.split(';'):
                    if ':' not in part:continue
                    k,v=part.split(':',1);k=k.strip();k=k if k.startswith('--') else re.sub(r'-([a-z])',lambda m:m[1].upper(),k);styles[k]=v.strip()
                out+=' style={'+json.dumps(styles,ensure_ascii=False)+'}'
            elif key=='checked' and tag=='input':out+=' defaultChecked={'+('true' if value is None or value in ('','checked','true') else 'false')+'}'
            elif value is None:out+=' '+key+'={true}'
            elif key in ('value','checked') and tag in ('input','textarea'):
                out+=' '+('defaultValue' if key=='value' else 'defaultChecked')+'={'+json.dumps(value,ensure_ascii=False)+'}'
            elif key=='draggable':out+=' draggable={'+('true' if value=='true' else 'false')+'}'
            else:out+=' '+key+'={'+json.dumps(value,ensure_ascii=False)+'}'
        out+= '/>' if tag in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'] else '>'
        self.out.append(out)
    def handle_endtag(self,tag):self.out.append('</'+tag+'>')
    def handle_data(self,data):self.out.append('{'+json.dumps(data,ensure_ascii=False)+'}')
root=Path(__file__).resolve().parent.parent
for item in json.loads(Path(sys.argv[1]).read_text()):
    parser=JSX();parser.feed(item['html']);jsx=''.join(parser.out)
    source='''"use client";
// ADP / %s. React 18+ or Next.js App Router. No UI dependencies.
// Local interactions: connect your own model, persistence, and router.
// Listen for the bubbling adp-navigate event to integrate application navigation.
import { useEffect, useRef } from "react";

%s

export default function %s() {
  const root = useRef(null);
  useEffect(() => mountDemo(root.current), []);
  return (
    <div ref={root} className="%s">
      <style>{%s}</style>
      %s
    </div>
  );
}
'''%(item['name'],item['runtime'],item['name'],item['scope'],json.dumps(item['css'],ensure_ascii=False),jsx)
    (root/'sources'/item['id']/item['lang']/(item['name']+'.jsx')).write_text(source)
