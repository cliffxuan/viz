(this.webpackJsonphierarchy=this.webpackJsonphierarchy||[]).push([[0],{139:function(e,a,t){e.exports=t(193)},144:function(e,a,t){},193:function(e,a,t){"use strict";t.r(a);var n=t(2),r=t.n(n),i=t(47),c=t.n(i),o=(t(144),t(116)),l=t(10),s=t.n(l),d=t(14),u=t(11),h=t(220),p=t(231),m=t(224),f=t(222),v=t(223),g=t(228),y=t(225),b=t(195),E=t(121),x=t.n(E),w=t(227),k=t(117),j=t.n(k),O=t(90),I=t.n(O),z=t(132),N=t(19),S=(t(153),{$schema:"https://vega.github.io/schema/vega/v5.json",description:"An example of Cartesian layouts for a node-link diagram of hierarchical data.",width:600,height:1600,padding:5,signals:[],data:[{name:"tree",transform:[{type:"stratify",key:"id",parentKey:"parent"},{type:"tree",method:"tidy",size:[{signal:"height"},{signal:"width - 100"}],separation:!1,as:["y","x","depth","children"]}]},{name:"links",source:"tree",transform:[{type:"treelinks"},{type:"linkpath",orient:"horizontal",shape:"diagonal"}]}],scales:[{name:"color",type:"linear",range:{scheme:"magma"},domain:{data:"tree",field:"depth"},zero:!0}],marks:[{type:"path",from:{data:"links"},encode:{update:{path:{field:"path"},stroke:{value:"#ccc"}}}},{type:"symbol",from:{data:"tree"},encode:{enter:{size:{value:100},stroke:{value:"#fff"}},update:{x:{field:"x"},y:{field:"y"},fill:{scale:"color",field:"depth"}}}},{type:"text",from:{data:"tree"},encode:{enter:{text:{field:"name"},fontSize:{value:9},baseline:{value:"middle"}},update:{x:{field:"x"},y:{field:"y"},dx:{signal:"datum.children ? -7 : 7"},align:{signal:"datum.children ? 'right' : 'left'"}}}}]}),B=t(1),C=t(219),A=t(230),J=t(226),D=t(229);function M(e){var a,t={},n=-1,r=e.split("\n").map((function(e){return e.split(";")})).reduce(J.a,[]).map((function(e){return e.trim()})).filter((function(e){return""!==e})).map((function(e){return function(e){var a=e.split("->").map((function(e){return e.trim()}));return Object(C.a)(a,Object(A.a)(1,1/0,a))}(e)})).reduce(J.a,[]),i=[],c=Object(B.a)(Object(D.a)(r));try{for(c.s();!(a=c.n()).done;){var o=Object(u.a)(a.value,2),l=o[0],s=o[1],d=t[l];void 0===d&&(t[l]=d=++n,i.push({id:d,name:l}));var h=++n;t[s]=h,i.push({id:h,name:s,parent:d})}}catch(p){c.e(p)}finally{c.f()}return{tree:i}}t(156);var R=Object(h.a)((function(e){return Object(p.a)({root:{height:"100vh",display:"flex",flexDirection:"column"},appBar:{backgroundColor:"#fff",color:"#000"},saveButton:{marginLeft:e.spacing(6)},main:{flexGrow:1,flexDirection:"row-reverse",overflow:"auto",padding:e.spacing(1)},pane:{height:"100%"},paper:{color:e.palette.text.secondary,height:"100%",overflow:"auto"}})}));I.a.initializeApp({apiKey:"AIzaSyAcRmmHUN_Yyqd0al0MSvRz82kIbrHvh-8",authDomain:"hierarchy-28591.firebaseapp.com",databaseURL:"https://hierarchy-28591.firebaseio.com",projectId:"hierarchy-28591",storageBucket:"hierarchy-28591.appspot.com",messagingSenderId:"761635818549",appId:"1:761635818549:web:b6d6fecfd7747c6345f57c",measurementId:"G-TJJF0BJ57G"});var q=I.a.firestore();function G(){return r.a.createElement(z.a,null,r.a.createElement(N.d,null,r.a.createElement(N.b,{path:"/:docId",render:function(e){var a=e.match;return r.a.createElement(K,{docId:a.params.docId})}}),r.a.createElement(N.b,{path:"/",render:function(){return r.a.createElement(K,{docId:"default"})}})))}function H(e){for(var a="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=t.length,r=0;r<e;r++)a+=t.charAt(Math.floor(Math.random()*n));return a}function K(e){var a=e.docId,t=Object(n.useState)(""),i=Object(u.a)(t,2),c=i[0],o=i[1],l=Object(n.useState)(null),h=Object(u.a)(l,2),p=h[0],m=h[1];return Object(n.useEffect)((function(){(function(){var e=Object(d.a)(s.a.mark((function e(){var t,n,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,q.collection("graphs").doc(a).get();case 2:n=e.sent,r=null===(t=n.data())||void 0===t?void 0:t.graph,n.exists&&null!==r?(m(null),o(r.replace(/\\n/gi,"\n"))):m("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[a]),null!==p?r.a.createElement(N.a,{to:p}):r.a.createElement(L,{data:c,handleChange:o,handleSave:function(){var e=Object(d.a)(s.a.mark((function e(a){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=H(6),e.next=3,q.collection("graphs").doc(t).set({graph:a});case 3:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}()})}function L(e){var a=e.data,t=e.handleChange,n=e.handleSave,i=M(a),c=R(),l=i.tree.length,s=l*(l>200?7:.2*(235-l));return r.a.createElement("div",{className:c.root},r.a.createElement(f.a,{position:"static",className:c.appBar},r.a.createElement(v.a,null,r.a.createElement(m.a,{variant:"h6"},"Visualize Hierarchical Data"),r.a.createElement(g.a,{className:c.saveButton,onClick:function(){return n(a)}},r.a.createElement(x.a,null),"save"))),r.a.createElement(y.a,{container:!0,spacing:1,className:c.main},r.a.createElement(y.a,{item:!0,xs:12,md:8,className:c.pane},r.a.createElement(b.a,{variant:"outlined",className:c.paper,square:!0},r.a.createElement(w.a,{spec:Object(o.a)({},S,{height:s}),data:i}))),r.a.createElement(y.a,{item:!0,xs:12,md:4,className:c.pane},r.a.createElement(b.a,{variant:"outlined",className:c.paper,square:!0},r.a.createElement(j.a,{mode:"plain_text",placeholder:"Root -> Parent -> Child;",theme:"github",onChange:function(e){return t(e)},value:a,width:"100%",height:"100%"})))))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(G,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[139,1,2]]]);
//# sourceMappingURL=main.f4a6e624.chunk.js.map