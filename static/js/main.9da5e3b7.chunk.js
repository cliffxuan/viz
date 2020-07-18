(this.webpackJsonphierarchy=this.webpackJsonphierarchy||[]).push([[0],{145:function(e,t,n){e.exports=n(218)},150:function(e,t,n){},218:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n.n(a),i=n(48),c=n.n(i),s=(n(150),n(123)),o=n(10),l=n.n(o),u=n(15),d=n(11),h=n(247),f=n(258),p=n(251),m=n(249),v=n(250),g=n(255),y=n(252),b=n(220),k=n(134),j=n.n(k),O=n(254),E=n(95),w=n.n(E),x=n(96),M=n.n(x),T=n(138),I=n(20),A=(n(180),{$schema:"https://vega.github.io/schema/vega/v5.json",description:"An example of Cartesian layouts for a node-link diagram of hierarchical data.",width:600,height:1600,padding:5,signals:[],data:[{name:"tree",transform:[{type:"stratify",key:"id",parentKey:"parent"},{type:"tree",method:"tidy",size:[{signal:"height"},{signal:"width - 100"}],separation:!1,as:["y","x","depth","children"]}]},{name:"links",source:"tree",transform:[{type:"treelinks"},{type:"linkpath",orient:"horizontal",shape:"diagonal"}]}],scales:[{name:"color",type:"linear",range:{scheme:"magma"},domain:{data:"tree",field:"depth"},zero:!0}],marks:[{type:"path",from:{data:"links"},encode:{update:{path:{field:"path"},stroke:{value:"#ccc"}}}},{type:"symbol",from:{data:"tree"},encode:{enter:{size:{value:100},stroke:{value:"#fff"}},update:{x:{field:"x"},y:{field:"y"},fill:{scale:"color",field:"depth"}}}},{type:"text",from:{data:"tree"},encode:{enter:{text:{field:"name"},fontSize:{value:9},baseline:{value:"middle"}},update:{x:{field:"x"},y:{field:"y"},dx:{signal:"datum.children ? -7 : 7"},align:{signal:"datum.children ? 'right' : 'left'"}}}}]}),z=n(23),B=n(29),D=n(8),N=n(7),S=n(1),C=n(5),J=n(6),R=n(244),L=n(259),q=n(245),G=n(257),H=n(253),F=n(256),K=n(246),U=function(){function e(t,n,a,r){Object(C.a)(this,e),this.id=void 0,this.name=void 0,this.predecessors=void 0,this.successors=void 0,this.id=t,this.name=n,this.predecessors=null!==a&&void 0!==a?a:[],this.successors=null!==r&&void 0!==r?r:[]}return Object(J.a)(e,[{key:"depth",value:function(e){if(!this.isAcyclic)return 1/0;if(void 0!==e){var t=e[this.id];if(void 0!==t)return t}var n=this.predecessors.length>0?Object(R.a)(Math.min,this.predecessors.map((function(t){return t.depth(e)})))+1:1;return void 0!==e&&(e[this.id]=n),n}},{key:"pathTo",value:function(e,t){if(void 0===t&&(t=[]),0===this.successors.length)return null;var n,a=Object(S.a)(this.successors);try{for(a.s();!(n=a.n()).done;){var r=n.value;if(r===e)return[this,r];if(t.includes(r))return null;t.push(r);var i=r.pathTo(e,t);if(null!==i)return[this].concat(i)}}catch(c){a.e(c)}finally{a.f()}return null}},{key:"isDescendant",value:function(e){var t=this;return e===this||e.successors.filter((function(e){return t.isDescendant(e)})).length>0}},{key:"descendants",get:function(){return this.successors.concat(Object(L.a)(this.successors.map((function(e){return e.descendants}))))}},{key:"isAcyclic",get:function(){if(null!==this.pathTo(this))return!1;var e,t=Object(S.a)(this.successors);try{for(t.s();!(e=t.n()).done;){if(!e.value.isAcyclic)return!1}}catch(n){t.e(n)}finally{t.f()}return!0}}]),e}(),V=function(){function e(t){Object(C.a)(this,e),this.vertices=void 0,this.vertices=t}return Object(J.a)(e,[{key:"depth",get:function(){if(!this.isAcyclic)return 1/0;var e={};return Object(R.a)(Math.max,this.vertices.map((function(t){return t.depth(e)})))}},{key:"breadth",get:function(){return this.vertices.filter((function(e){return 0===e.successors.length})).length}},{key:"data",get:function(){var e=this;return this.isTree||this.isMultiTree?this.roots.map((function(t){return e.vertices.filter((function(e){return e.isDescendant(t)})).map((function(e){var t;return{id:e.id,name:e.name,parent:null===(t=e.predecessors[0])||void 0===t?void 0:t.id}}))})):[]}},{key:"roots",get:function(){return this.vertices.filter((function(e){return 0===e.predecessors.length}))}},{key:"isTree",get:function(){return 1===this.roots.length&&!(this.vertices.filter((function(e){return e.predecessors.length>1})).length>0)}},{key:"isMultiTree",get:function(){return!(this.roots.length<2)&&!(this.vertices.filter((function(e){return e.predecessors.length>1})).length>0)}},{key:"isAcyclic",get:function(){return 0===this.vertices.length||0!==this.roots.length&&(1!==this.roots.length||this.roots[0].isAcyclic)}}]),e}(),W=function(e){Object(N.a)(n,e);var t=Object(D.a)(n);function n(e){var a;if(Object(C.a)(this,n),!(a=t.call(this,e)).isTree)throw new Error("invalid tree");return a}return Object(J.a)(n,[{key:"data",get:function(){return Object(B.a)(Object(z.a)(n.prototype),"data",this)[0]}}],[{key:"fromRoot",value:function(e){return new n([e].concat(e.descendants))}}]),n}(V);function Y(e){var t=e.split("->").map((function(e){return e.trim()}));return Object(q.a)(t,Object(G.a)(1,1/0,t))}var $=Object(h.a)((function(e){return Object(f.a)({root:{height:"100vh",display:"flex",flexDirection:"column"},appBar:{backgroundColor:"#fff",color:"#000"},saveButton:{marginLeft:e.spacing(6)},main:{flexGrow:1,flexDirection:"row-reverse",overflow:"auto",padding:e.spacing(1)},pane:{height:"100%"},paper:{color:e.palette.text.secondary,height:"100%",overflow:"auto"}})}));M.a.initializeApp({apiKey:"AIzaSyAcRmmHUN_Yyqd0al0MSvRz82kIbrHvh-8",authDomain:"hierarchy-28591.firebaseapp.com",databaseURL:"https://hierarchy-28591.firebaseio.com",projectId:"hierarchy-28591",storageBucket:"hierarchy-28591.appspot.com",messagingSenderId:"761635818549",appId:"1:761635818549:web:b6d6fecfd7747c6345f57c",measurementId:"G-TJJF0BJ57G"});var _=M.a.firestore();function P(){return r.a.createElement(T.a,null,r.a.createElement(I.d,null,r.a.createElement(I.b,{path:"/:docId",render:function(e){var t=e.match;return r.a.createElement(X,{docId:t.params.docId})}}),r.a.createElement(I.b,{path:"/",render:function(){return r.a.createElement(X,{docId:"default"})}})))}function Q(e){for(var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=n.length,r=0;r<e;r++)t+=n.charAt(Math.floor(Math.random()*a));return t}function X(e){var t=e.docId,n=Object(a.useState)(""),i=Object(d.a)(n,2),c=i[0],s=i[1],o=Object(a.useState)(null),h=Object(d.a)(o,2),f=h[0],p=h[1];return Object(a.useEffect)((function(){(function(){var e=Object(u.a)(l.a.mark((function e(){var n,a,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_.collection("graphs").doc(t).get();case 2:a=e.sent,r=null===(n=a.data())||void 0===n?void 0:n.graph,a.exists&&null!==r?(p(null),s(r.replace(/\\n/gi,"\n"))):p("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[t]),null!==f?r.a.createElement(I.a,{to:f}):r.a.createElement(ee,{data:c,handleChange:s,handleSave:function(){var e=Object(u.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Q(6),e.next=3,_.collection("graphs").doc(n).set({graph:t});case 3:p(n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})}function Z(e){var t=e.multiTree;return r.a.createElement(r.a.Fragment,null,t.roots.map((function(e,t){var n=W.fromRoot(e),a=n.depth,i=a===1/0?600:120*a,c=n.breadth,o=c*(30*Math.pow(Math.E,-c/40)+7);return r.a.createElement(O.a,{key:t,spec:Object(s.a)({},A,{width:i,height:o}),data:{tree:n.data}})})))}function ee(e){var t=e.data,n=e.handleChange,a=e.handleSave,i=$(),c=function(e){var t,n=e.split("\n").map((function(e){return e.split(";")})).reduce(H.a,[]).map((function(e){return e.trim()})).filter((function(e){return""!==e})).map(Y).reduce(H.a,[]),a={},r=-1,i=Object(S.a)(Object(F.a)(n));try{for(i.s();!(t=i.n()).done;){var c,s,o=Object(d.a)(t.value,2),l=o[0],u=o[1],h=null===(c=a[l])||void 0===c?void 0:c.id,f=null===(s=a[u])||void 0===s?void 0:s.id;void 0===h&&(h=++r,a[l]=new U(h,l)),void 0===f?(f=++r,a[u]=new U(f,u,[a[l]])):a[u].predecessors.push(a[l]),a[l].successors.push(a[u])}}catch(p){i.e(p)}finally{i.f()}return new V(Object(K.a)(a))}(t);return r.a.createElement("div",{className:i.root},r.a.createElement(m.a,{position:"static",className:i.appBar,elevation:1},r.a.createElement(v.a,null,r.a.createElement(p.a,{variant:"h6"},"Visualize Hierarchical Data"),r.a.createElement(g.a,{className:i.saveButton,onClick:function(){return a(t)}},r.a.createElement(j.a,null),"save"))),r.a.createElement(y.a,{container:!0,spacing:1,className:i.main},r.a.createElement(y.a,{item:!0,xs:12,md:8,className:i.pane},r.a.createElement(b.a,{variant:"outlined",className:i.paper,square:!0},c.isTree||c.isMultiTree?r.a.createElement(Z,{multiTree:c}):null)),r.a.createElement(y.a,{item:!0,xs:12,md:4,className:i.pane},r.a.createElement(b.a,{variant:"outlined",className:i.paper,square:!0},r.a.createElement(w.a,{language:"plain_text",value:t,width:"100%",editorDidMount:function(e,t){return t.onDidChangeModelContent((function(){return n(t.getValue())}))},options:{minimap:{enabled:!1},scrollBeyondLastLine:!1}})))))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[145,1,2]]]);
//# sourceMappingURL=main.9da5e3b7.chunk.js.map