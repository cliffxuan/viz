(this.webpackJsonphierarchy=this.webpackJsonphierarchy||[]).push([[0],{129:function(e,t,n){},196:function(e,t,n){"use strict";n.r(t);var r=n(11),a=n(2),i=n.n(a),s=n(39),c=n.n(s),o=(n(129),n(26)),u=n(8),l=n.n(u),h=n(16),d=n(9),f=n(227),p=n(239),v=n(233),j=n(231),m=n(232),b=n(234),g=n(235),O=n(236),y=n(199),x=n(230),k=n(229),w=n(111),M=n.n(w),S=n(112),A=n.n(S),T=n(114),N=n.n(T),C=n(113),I=n.n(C),R=n(237),z=n(60),B=n(82),D=n.n(B),L=n(109),E=n(15),J=(n(160),{$schema:"https://vega.github.io/schema/vega/v5.json",description:"An example of Cartesian layouts for a node-link diagram of hierarchical data.",width:600,height:1600,padding:5,signals:[],data:[{name:"tree",transform:[{type:"stratify",key:"id",parentKey:"parent"},{type:"tree",method:"tidy",size:[{signal:"height"},{signal:"width - 100"}],separation:!1,as:["y","x","depth","children"]}]},{name:"links",source:"tree",transform:[{type:"treelinks"},{type:"linkpath",orient:"horizontal",shape:"diagonal"}]}],scales:[{name:"color",type:"linear",range:{scheme:"magma"},domain:{data:"tree",field:"depth"},zero:!0}],marks:[{type:"path",from:{data:"links"},encode:{update:{path:{field:"path"},stroke:{value:"#ccc"}}}},{type:"symbol",from:{data:"tree"},encode:{enter:{size:{value:100},stroke:{value:"#fff"}},update:{x:{field:"x"},y:{field:"y"},fill:{scale:"color",field:"depth"}}}},{type:"text",from:{data:"tree"},encode:{enter:{text:{field:"name"},fontSize:{value:9},baseline:{value:"middle"}},update:{x:{field:"x"},y:{field:"y"},dx:{signal:"datum.children ? -7 : 7"},align:{signal:"datum.children ? 'right' : 'left'"}}}}]}),q=n(1),G=n(5),H=n(6),F=n(226),K=n(238),U=n(224),W=n(225),_=function(){function e(t,n){Object(G.a)(this,e),this.start=t,this.end=n}return Object(H.a)(e,[{key:"toString",value:function(){return"".concat(this.start," -> ").concat(this.end)}},{key:"toPair",value:function(){return[this.start,this.end]}}]),e}();function P(e,t){var n,r=e.split(t),a=[1],i=Object(q.a)(r);try{for(i.s();!(n=i.n()).done;){var s=n.value,c=a[a.length-1];a[a.length-1]=c+s.search(/\S/),a.push(c+s.length+t.length)}}catch(o){i.e(o)}finally{i.f()}return Object(U.a)(r.map((function(e){return e.trim()})),a)}function V(e){var t=e.split("\n").map((function(e,t){return P(e,";").filter((function(e){var t=Object(d.a)(e,2),n=t[0];t[1];return""!==n.trim()})).map((function(e){var n=Object(d.a)(e,2);return function(e,t,n){var r=P(e,"->");return Object(U.a)(r,r.slice(1)).map((function(e){var r=Object(d.a)(e,2),a=Object(d.a)(r[0],2),i=a[0],s=a[1],c=Object(d.a)(r[1],2),o=c[0],u=c[1];return{arrow:new _(i,o),startCol:t+s-1,endCol:t+u+o.length-1,startRow:n,endRow:n}}))}(n[0],n[1],t+1)}))}));return Object(W.a)(Object(K.a)(t).map((function(e,t){return[t,e]})))}var Y=function(){function e(t,n,r,a){Object(G.a)(this,e),this.id=void 0,this.name=void 0,this.predecessors=void 0,this.successors=void 0,this.id=t,this.name=n,this.predecessors=null!==r&&void 0!==r?r:[],this.successors=null!==a&&void 0!==a?a:[]}return Object(H.a)(e,[{key:"depth",value:function(e){if(!this.isAcyclic)return 1/0;if(void 0!==e){var t=e[this.id];if(void 0!==t)return t}var n=this.predecessors.length>0?Object(F.a)(Math.min,this.predecessors.map((function(t){return t.depth(e)})))+1:1;return void 0!==e&&(e[this.id]=n),n}},{key:"pathTo",value:function(e,t){if(void 0===t&&(t=[]),0===this.successors.length)return null;var n,r=Object(q.a)(this.successors);try{for(r.s();!(n=r.n()).done;){var a=n.value;if(a===e)return[this,a];if(t.includes(a))return null;t.push(a);var i=a.pathTo(e,t);if(null!==i)return[this].concat(i)}}catch(s){r.e(s)}finally{r.f()}return null}},{key:"isDescendant",value:function(e){var t=this;return e===this||e.successors.filter((function(e){return t.isDescendant(e)})).length>0}},{key:"descendants",get:function(){return this.successors.concat(Object(K.a)(this.successors.map((function(e){return e.descendants}))))}},{key:"isAcyclic",get:function(){if(null!==this.pathTo(this))return!1;var e,t=Object(q.a)(this.successors);try{for(t.s();!(e=t.n()).done;){if(!e.value.isAcyclic)return!1}}catch(n){t.e(n)}finally{t.f()}return!0}}]),e}(),$=function(){function e(t){Object(G.a)(this,e),this.vertices=void 0,this.vertices=t}return Object(H.a)(e,[{key:"findTree",value:function(){if(this.isTree||this.isMultiTree)return[this,[]];var t,n=[],r=[],a=e.fromArrows(n),i=Object(q.a)(this.arrows);try{for(i.s();!(t=i.n()).done;){var s=t.value;n.push(s);var c=e.fromArrows(n);c.isMultiTree||c.isTree?a=c:(n.pop(),r.push(s))}}catch(o){i.e(o)}finally{i.f()}return[a,r]}},{key:"arrows",get:function(){return Object(K.a)(this.vertices.map((function(e){return e.successors.map((function(t){return new _(e.name,t.name)}))})))}},{key:"depth",get:function(){if(!this.isAcyclic)return 1/0;var e={};return Object(F.a)(Math.max,this.vertices.map((function(t){return t.depth(e)})))}},{key:"breadth",get:function(){return this.vertices.filter((function(e){return 0===e.successors.length})).length}},{key:"roots",get:function(){return this.vertices.filter((function(e){return 0===e.predecessors.length}))}},{key:"isTree",get:function(){return 1===this.roots.length&&(!(this.vertices.filter((function(e){return e.predecessors.length>1})).length>0)&&!(this.vertices.filter((function(e){return e.predecessors.includes(e)})).length>0))}},{key:"isMultiTree",get:function(){return!(this.roots.length<2)&&(!(this.vertices.filter((function(e){return e.predecessors.length>1})).length>0)&&!(this.vertices.filter((function(e){return e.predecessors.includes(e)})).length>0))}},{key:"isAcyclic",get:function(){return 0===this.vertices.length||0!==this.roots.length&&(1!==this.roots.length||this.roots[0].isAcyclic)}}],[{key:"fromArrows",value:function(t){var n,r={},a=-1,i=Object(q.a)(t);try{for(i.s();!(n=i.n()).done;){var s,c,o=n.value,u=o.start,l=o.end,h=null===(s=r[u])||void 0===s?void 0:s.id,d=null===(c=r[l])||void 0===c?void 0:c.id;void 0===h&&(h=++a,r[u]=new Y(h,u)),void 0===d&&(d=++a,r[l]=new Y(d,l));var f=r[l],p=r[u];f.predecessors.push(p),p.successors.push(f)}}catch(v){i.e(v)}finally{i.f()}return new e(Object.values(r))}}]),e}(),Q=function(){function e(t){Object(G.a)(this,e),this.vertices=t}return Object(H.a)(e,[{key:"root",get:function(){return this.vertices.filter((function(e){return 0===e.predecessors.length}))[0]}},{key:"data",get:function(){var e=this;return this.vertices.filter((function(t){return t.isDescendant(e.root)})).map((function(e){var t;return{id:e.id,name:e.name,parent:null===(t=e.predecessors[0])||void 0===t?void 0:t.id}}))}},{key:"depth",get:function(){var e={};return Object(F.a)(Math.max,this.vertices.map((function(t){return t.depth(e)})))}},{key:"breadth",get:function(){return this.vertices.filter((function(e){return 0===e.successors.length})).length}}],[{key:"fromRoot",value:function(t){return new e([t].concat(t.descendants))}}]),e}();function X(e){var t=function(e){for(var t={},n=0,r=Object.values(e);n<r.length;n++){var a=r[n],i=a.arrow.toString();void 0===t[i]&&(t[i]=[]),t[i].push(a)}return t}(V(e)),n=Object.values(t).map((function(e){return e[0].arrow}));return[$.fromArrows(n),t]}var Z=Object(f.a)((function(e){return Object(p.a)({root:{height:"calc(100vh - 10px)",display:"flex",flexDirection:"column"},appBar:{backgroundColor:"#fff",color:"#000"},saveButton:{marginLeft:e.spacing(6)},toolbarRightDiv:{marginLeft:"auto"},toggleButton:{position:"absolute",top:"2px",right:"2px"},main:{flexGrow:1,flexDirection:"row-reverse",overflow:"auto",padding:e.spacing(1)},pane:{height:"100%"},paper:{color:e.palette.text.secondary,height:"100%",overflow:"auto"},center:{width:"50%",margin:"auto"}})}));D.a.initializeApp({apiKey:"AIzaSyAcRmmHUN_Yyqd0al0MSvRz82kIbrHvh-8",authDomain:"hierarchy-28591.firebaseapp.com",databaseURL:"https://hierarchy-28591.firebaseio.com",projectId:"hierarchy-28591",storageBucket:"hierarchy-28591.appspot.com",messagingSenderId:"761635818549",appId:"1:761635818549:web:b6d6fecfd7747c6345f57c",measurementId:"G-TJJF0BJ57G"});var ee=D.a.firestore();function te(){return Object(r.jsx)(L.a,{children:Object(r.jsxs)(E.d,{children:[Object(r.jsx)(E.b,{path:"/:docId",render:function(e){var t=e.match;return Object(r.jsx)(re,{docId:t.params.docId})}}),Object(r.jsx)(E.b,{path:"/",render:function(){return Object(r.jsx)(re,{docId:"default"})}})]})})}function ne(e){for(var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=n.length,a=0;a<e;a++)t+=n.charAt(Math.floor(Math.random()*r));return t}function re(e){var t=e.docId,n=Object(a.useState)(""),i=Object(d.a)(n,2),s=i[0],c=i[1],o=Object(a.useState)(null),u=Object(d.a)(o,2),f=u[0],p=u[1];return Object(a.useEffect)((function(){(function(){var e=Object(h.a)(l.a.mark((function e(){var n,r,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ee.collection("graphs").doc(t).get();case 2:r=e.sent,a=null===(n=r.data())||void 0===n?void 0:n.graph,r.exists&&null!==a?(p(null),c(a.replace(/\\n/gi,"\n"))):p("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[t]),null!==f?Object(r.jsx)(E.a,{to:f}):Object(r.jsx)(ie,{data:s,handleChange:c,handleSave:function(){var e=Object(h.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=ne(6),e.next=3,ee.collection("graphs").doc(n).set({graph:t});case 3:p(n);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})}function ae(e){var t=e.multiTree;return Object(r.jsx)(r.Fragment,{children:t.roots.map((function(e,t){var n=Q.fromRoot(e),a=n.depth,i=a===1/0?600:120*a,s=n.breadth,c=s*(30*Math.pow(Math.E,-s/40)+7);return Object(r.jsx)(R.a,{spec:Object(o.a)(Object(o.a)({},J),{},{width:i,height:c}),data:{tree:n.data}},t)}))})}function ie(e){var t=e.data,n=e.handleChange,i=(e.handleSave,Object(a.useRef)(null)),s=Z(),c=Object(a.useState)(!1),u=Object(d.a)(c,2),l=u[0],h=u[1],f=Object(a.useState)(!1),p=Object(d.a)(f,2),w=p[0],S=p[1],T=X(t),C=Object(d.a)(T,2),R=C[0],B=C[1],D=R.findTree(),L=Object(d.a)(D,2),E=L[0],J=L[1],q=Object(K.a)(J.map((function(e){return B[e.toString()]}))).map((function(e){return{startLineNumber:e.startRow,startColumn:e.startCol,endLineNumber:e.endRow,endColumn:e.endCol,message:"This arrow is discarded as it makes the tree invalid."}}));Object(a.useLayoutEffect)((function(){z.monaco.init().then((function(e){l&&null!==i.current&&e.editor.setModelMarkers(i.current.getModel(),"owner",q.map((function(t){return Object(o.a)(Object(o.a)({},t),{},{severity:e.MarkerSeverity.Error})})))}))}));var G=Object(k.a)(),H=Object(x.a)(G.breakpoints.down("sm"));return Object(r.jsxs)("div",{className:s.root,children:[Object(r.jsx)(j.a,{position:"static",className:s.appBar,elevation:1,children:Object(r.jsxs)(m.a,{children:[Object(r.jsx)(v.a,{variant:"h6",children:"Visualize Hierarchical Data"}),Object(r.jsxs)(b.a,{className:s.saveButton,children:[Object(r.jsx)(M.a,{}),"save"]}),Object(r.jsx)("div",{className:s.toolbarRightDiv,children:Object(r.jsx)(g.a,{href:"https://github.com/cliffxuan/viz",target:"_blank",rel:"noopener noreferrer",children:Object(r.jsx)(A.a,{})})})]})}),Object(r.jsxs)(O.a,{container:!0,spacing:1,className:s.main,children:[Object(r.jsxs)(O.a,{item:!0,xs:12,md:w?12:8,className:s.pane,style:{position:"relative"},children:[Object(r.jsx)(y.a,{variant:"outlined",className:s.paper,square:!0,children:Object(r.jsx)("div",{className:w?s.center:"",children:Object(r.jsx)(ae,{multiTree:E})})}),H?null:Object(r.jsx)(g.a,{className:s.toggleButton,size:"small",onClick:function(){return S(!w)},children:w?Object(r.jsx)(I.a,{}):Object(r.jsx)(N.a,{})})]}),w?null:Object(r.jsx)(O.a,{item:!0,xs:12,md:4,className:s.pane,children:Object(r.jsx)(y.a,{variant:"outlined",className:s.paper,square:!0,children:Object(r.jsx)(z.ControlledEditor,{language:"plain_text",value:t,width:"100%",editorDidMount:function(e,t){h(!0),i.current=t},onChange:function(e,t){return void 0===t?t:n(t)},options:{minimap:{enabled:!1},scrollBeyondLastLine:!1}})})})]})]})}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(te,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[196,1,2]]]);
//# sourceMappingURL=main.20b4f388.chunk.js.map