import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';


export class Home extends React.Component<RouteComponentProps<{}>, State> {
    constructor() {
        super();
        this.state = {
            text: '',
            formatType: 'xml',
            formatText: '',
            separatorCvs: ','
        }
    }

    public sendText(value: TextToSerializer) {
        let accept: string = value.formatType == "cvs" ? 'text/plain' : 'text/xml';
        let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': accept });
        let initFetch = { method: "POST", headers: headers, body: JSON.stringify(value) };

        fetch('/api/TextSerializer', initFetch)
            .then(response => response.text())
            .then(data => {
                let content = JSON.parse(data);
                this.setState({ formatText: content['formatText'] });
            });
    }

    public handleTextSend() {
        this.sendText({
            text: this.state.text,
            formatType: this.state.formatType,
            separatorCvs: this.state.separatorCvs
        });
    }

    public handleTextChange(event: any):void {
        this.setState({ text: event.target.value })
    }

    public handleFormatTypeChange(event: any): void {
        this.setState({ formatType: event.target.value })
    }

    public handleSeparatorCvsTypeChange(event: any): void {
        this.setState({ separatorCvs: event.target.value })
    }

    public formatPrettyXml(xml: any) {
        if (xml.match('\W')) { return xml; }

        let reg: RegExp = /(>)\s*(<)(\/*)/g;
        let element: JSX.Element[] = [];
        let wsexp: RegExp = / *(.*) +\n/g;
        let contexp: RegExp = /(<.+>)(.+\n)/g;

        let pad: number = 0;
        let formatted: string = '';
        let indent: number = 0;
        let lastType: string = 'other';
        let transitions: any = {
            'single->single': 0,
            'single->closing': -1,
            'single->opening': 0,
            'single->other': 0,
            'closing->single': 0,
            'closing->closing': -1,
            'closing->opening': 0,
            'closing->other': 0,
            'opening->single': 1,
            'opening->closing': 0,
            'opening->opening': 1,
            'opening->other': 1,
            'other->single': 0,
            'other->closing': -1,
            'other->opening': 0,
            'other->other': 0
        };

        let lines: any = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2').split('\n');

        for (let i = 0; i < lines.length; i++) {
            let ln: any = lines[i];

            if (ln.match(/\s*<\?xml/)) {
                formatted += `${ln}\n`;
                continue;
            }

            let single: boolean = Boolean(ln.match(/<.+\/>/));
            let closing: boolean = Boolean(ln.match(/<\/.+>/)); 
            let opening: boolean = Boolean(ln.match(/<[^!].*>/)); 

            let type: string = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            let fromTo: string = `${lastType}->${type}`;
            lastType = type;
            let padding: string = '';

            indent += transitions[fromTo];

            for (let j = 0; j < indent; j++) {
                padding += '\t';
            }
            if (fromTo == 'opening->closing') {
                formatted = `${formatted.substr(0, formatted.length - 1)}${ln}\n`; 
            } else {
                formatted += `${padding}${ln}\n`;
            }
        }

       return formatted;
    }

    public render() {
        return (
            <div>
                {this.renderForm()}
                {this.renderConsole()}
            </div>
        );
    }

    public renderConsole() {
        let content = this.formatPrettyXml(this.state.formatText);

        return (
            <div className="console" style={{ whiteSpace: 'pre', border: '1px solid lightgray', overflow: 'auto' }} >{content}</div>
        )
    }

    public  renderForm() {
        return (
            <form>
                <div className="form-group">
                    <label >Example textarea*</label>
                    <textarea className="form-control" onChange={(event) => this.handleTextChange(event)} rows={8} maxLength={2500} max={100} required></textarea>
                </div>
                <div className="form-group">
                    <label>Format*</label>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input className="form-check-input" type="radio" name="formatType" id="inlineRadio1" value="xml"
                                checked={this.state.formatType == 'xml'} onChange={(event) => this.handleFormatTypeChange(event)} required />xml
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input className="form-check-input" type="radio" name="formatType" id="inlineRadio2" value="cvs"
                                checked={this.state.formatType == 'cvs'} onChange={(event) => this.handleFormatTypeChange(event)} required />cvs
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Separator</label>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input className="form-check-input" disabled={this.state.formatType != "cvs"} type="radio" name="separatorCvs"
                                id="inlineRadio3" value="," checked={this.state.separatorCvs == ','} onChange={(event) => this.handleSeparatorCvsTypeChange(event)} />comma
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input className="form-check-input" disabled={this.state.formatType != "cvs"} type="radio" name="separatorCvs"
                                id="inlineRadio4" value="||" checked={this.state.separatorCvs == '||'} onChange={(event) => this.handleSeparatorCvsTypeChange(event)} />||
                        </label>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                        <button type="button" className="btn btn-primary" onClick={() => this.handleTextSend()}>Format</button>
                    </div>
                </div>
            </form>
        )
    }
}

interface State {
    text: string,
    formatType: string,
    formatText: any,
    separatorCvs: string
}

interface TextToSerializer {
    text: string,
    formatType: string,
    separatorCvs: string
}
