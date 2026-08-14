import * as THREE from 'three';

export class GeometryBuilder {
  public geos: Record<string, THREE.BufferGeometry[]> = {};
  private matrixStack: THREE.Matrix4[] = [new THREE.Matrix4()];

  public pushMatrix(mat: THREE.Matrix4) {
    const current = this.matrixStack[this.matrixStack.length - 1];
    const next = current.clone().multiply(mat);
    this.matrixStack.push(next);
  }

  public popMatrix() {
    this.matrixStack.pop();
  }

  public addBox(matName: string, w: number, h: number, d: number, pos?: [number, number, number], rot?: [number, number, number]) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.Matrix4();
    if (rot) {
      const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
      mat.makeRotationFromEuler(euler);
    }
    if (pos) {
      mat.setPosition(pos[0], pos[1], pos[2]);
    }
    const current = this.matrixStack[this.matrixStack.length - 1];
    geo.applyMatrix4(mat.premultiply(current));
    
    if (!this.geos[matName]) this.geos[matName] = [];
    this.geos[matName].push(geo);
  }

  public addCylinder(matName: string, rt: number, rb: number, h: number, rs: number, pos?: [number, number, number], rot?: [number, number, number]) {
    const geo = new THREE.CylinderGeometry(rt, rb, h, rs);
    const mat = new THREE.Matrix4();
    if (rot) {
      const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
      mat.makeRotationFromEuler(euler);
    }
    if (pos) {
      mat.setPosition(pos[0], pos[1], pos[2]);
    }
    const current = this.matrixStack[this.matrixStack.length - 1];
    geo.applyMatrix4(mat.premultiply(current));
    
    if (!this.geos[matName]) this.geos[matName] = [];
    this.geos[matName].push(geo);
  }

  public addCone(matName: string, r: number, h: number, rs: number, pos?: [number, number, number], rot?: [number, number, number]) {
    const geo = new THREE.ConeGeometry(r, h, rs);
    const mat = new THREE.Matrix4();
    if (rot) {
      const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
      mat.makeRotationFromEuler(euler);
    }
    if (pos) {
      mat.setPosition(pos[0], pos[1], pos[2]);
    }
    const current = this.matrixStack[this.matrixStack.length - 1];
    geo.applyMatrix4(mat.premultiply(current));
    
    if (!this.geos[matName]) this.geos[matName] = [];
    this.geos[matName].push(geo);
  }

  public addPlane(matName: string, w: number, h: number, pos?: [number, number, number], rot?: [number, number, number]) {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.Matrix4();
    if (rot) {
      const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
      mat.makeRotationFromEuler(euler);
    }
    if (pos) {
      mat.setPosition(pos[0], pos[1], pos[2]);
    }
    const current = this.matrixStack[this.matrixStack.length - 1];
    geo.applyMatrix4(mat.premultiply(current));
    
    if (!this.geos[matName]) this.geos[matName] = [];
    this.geos[matName].push(geo);
  }

  public addSphere(matName: string, r: number, ws: number, hs: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, pos?: [number, number, number], rot?: [number, number, number]) {
    const geo = new THREE.SphereGeometry(r, ws, hs, phiStart, phiLength, thetaStart, thetaLength);
    const mat = new THREE.Matrix4();
    if (rot) {
      const euler = new THREE.Euler(rot[0], rot[1], rot[2], 'XYZ');
      mat.makeRotationFromEuler(euler);
    }
    if (pos) {
      mat.setPosition(pos[0], pos[1], pos[2]);
    }
    const current = this.matrixStack[this.matrixStack.length - 1];
    geo.applyMatrix4(mat.premultiply(current));
    
    if (!this.geos[matName]) this.geos[matName] = [];
    this.geos[matName].push(geo);
  }
}
