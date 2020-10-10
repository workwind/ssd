
const style = {
    canvas : {
        width: 1280,
        height: 800
    },
    actor:{
        width : 120,
        height:60
    },
    margin : {
        top: 50,
        bottom: 50
    },
    arrow:{
        triangle:{
            dx:9,
            dy:5
        }
    }
}

//去左空格bai;
function ltrim(s){
    return s.replace( /^\s*/, "");
}
//去右空格;
function rtrim(s){
    return s.replace( /\s*$/, "");
}
//左右空格;
function trim(s){
    return rtrim(ltrim(s));
}

function Arrow(from ,type, to , message){
    this.from = from;
    this.to = to ;
    this.type = type; //1 is -> ; 2 is -->; 3 is ...>
    this.message = message;
    this.arrowY = 0;

    this.fromX = function (){
        return this.from.x + this.from.width/2 ;
    }

    this.toX = function (){
        return this.to.x + this.to.width/2;
    }

    this.draw = function (ctx,style){
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";

        ctx.beginPath();

        if( this.type == 3 ){
            //画虚线
            ctx.setLineDash([10,3]);
        }else{
            ctx.setLineDash([10,0]);
        }
        //画实线
        ctx.moveTo(this.fromX() , this.arrowY );
        ctx.lineTo(this.toX() ,this.arrowY);
        ctx.stroke();
        //画箭头
        ctx.beginPath();
        const dx = this.fromX() < this.toX() ?  (-1) * style.arrow.triangle.dx : style.arrow.triangle.dx;
        ctx.moveTo(this.toX() + dx , this.arrowY - style.arrow.triangle.dy);
        ctx.lineTo(this.toX() ,this.arrowY);
        ctx.lineTo(this.toX() +dx ,this.arrowY + style.arrow.triangle.dy);
        if(this.type == 1){
            ctx.closePath();
            ctx.fill();
        }
        ctx.stroke();


        //画文字消息
        ctx.font="10pt Arial";
        ctx.textBaseline = "bottom";
        ctx.fillText(this.message, (this.fromX() + this.toX()) / 2 , this.arrowY , this.toX() - this.fromX()  );
    }
}

function Actor(objectName,className){
    this.objectName = trim(objectName);
    this.className = trim(className);
    this.x = 0;
    this.y = 0;
    this.width = style.actor.width;//default value
    this.height =style.actor.height;//default value

    this.draw = function (ctx){
        //画参与者框框
        ctx.beginPath();
        ctx.fillStyle="#176AA6";
        ctx.fillRect(this.x, this.y,this.width , this.height);
        //填写文字
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign="center";
        ctx.font="15pt Arial";
        ctx.fillText(this.className, this.x + this.width / 2 , this.y + this.height *3/4, this.width);
        //画生命线
        ctx.strokeStyle  = "#176AA6";
        ctx.setLineDash([10,3]);
        const lifeLineX = this.x + this.width / 2;
        const y1 = this.y + this.height;
        const y2 = y1 +500; //TODO 抽出变量
        ctx.moveTo( lifeLineX,y1 );
        ctx.lineTo( lifeLineX ,y2);
        ctx.stroke();
    }

}

function findActor(actors,objectName){
    for(let i = 0 ; i< actors.length; i++){
        if(actors[i].objectName=== trim(objectName)){
            return actors[i];
        }
    }
}

/*
    将一个字符串解释为参与者实体与箭头实体,并放入相应的数组
*/
function analyse(ssdd,actors,arrows){
    let rows = ssdd.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        console.log(row);
        const index = row.indexOf(":");
        if( index>0 && index< row.length){
            const tag = row.substring(0,index)
            const message = row.substring(index+1, row.length);
            //判断处理返回消息
            let ti = tag.indexOf("...>");
            if (ti >0 && ti < tag.length){
                from = findActor(actors,tag.substring(0,ti) );
                to = findActor(actors,tag.substring(ti+4, tag.length) );
                let returnArrow =new Arrow(from,3,to, message);
                console.log(returnArrow);
                arrows.push(returnArrow);
                continue;
            }
            //判断处理异步消息
            ti = tag.indexOf("-->");
            if (ti >0 && ti < tag.length){
                from = findActor(actors,tag.substring(0,ti) );
                to = findActor(actors,tag.substring(ti+3, tag.length) );
                let asyncArrow =new Arrow(from ,2, to, message);
                console.log(asyncArrow);
                arrows.push(asyncArrow);
                continue;
            }
            //判断同步消息
            ti = tag.indexOf("->");
            if (ti >0 && ti < tag.length){
                from = findActor(actors,tag.substring(0,ti) );
                to = findActor(actors,tag.substring(ti+2, tag.length) );
                let syncArrow =new Arrow(from ,1, to, message);
                console.log(syncArrow);
                arrows.push(syncArrow);
                continue;
            }
            //剩余的是Actor声明
            actors.push(new Actor(tag,message));
        }
    }
    console.log("actors.length : "+actors.length);
    console.log("arrows.length : "+arrows.length);
}

function initLocation(actors,style){
    let margin = ( style.canvas.width -( style.actor.width * actors.length) ) / (actors.length + 1 ) ;
    let x = margin;
    for(let i =0; i<actors.length ; i++){
        const a = actors[i];
        a.x = x;
        a.y = style.margin.top;
        x = x + style.actor.width + margin;
    }
}

function generate(){

    const ssdd = document.getElementById("ssdd").value;
    console.log(ssdd);
    let actors = new Array();
    let arrows = new Array();
    analyse(ssdd, actors, arrows);

    initLocation(actors, style);

    const c = document.getElementById("ssd");
    const ctx = c.getContext("2d");

    for (let i = 0; i < actors.length; i++) {
        actors[i].draw(ctx);
    }

    let arrowY = style.actor.height + 100;
    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        arrowY = arrowY + 50;
        arrow.arrowY = arrowY;
        arrow.draw(ctx, style);
    }

event.preventDefault();
}
