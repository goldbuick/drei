import * as React from 'react'
import { Raycaster, Camera, Intersection } from 'three'
import { useThree, applyProps } from '@react-three/fiber'

export function useCamera(camera: Camera | React.MutableRefObject<Camera>, props?: Partial<Raycaster>) {
  const mouse = useThree((state) => state.mouse)
  const [raycast] = React.useState(() => {
    let raycaster = new Raycaster()
    /**
     * applyProps is an internal method of r3f and
     * therefore requires its first arg to be an
     * "Instance" a term used with the Reconciler
     * so we have an expect error to mask this
     */
    // @ts-expect-error
    if (props) applyProps(raycaster, props, {})
    return function (_: Raycaster, intersects: Intersection[]): void {
      raycaster.setFromCamera(mouse, camera instanceof Camera ? camera : camera.current)
      const rc = this.constructor.prototype.raycast.bind(this)
      if (rc) rc(raycaster, intersects)
    }
  })
  return raycast
}
