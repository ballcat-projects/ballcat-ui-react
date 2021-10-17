import AntdIcon from '@ant-design/icons';
import type { SvgIconProps } from './typings';

export default {
  Straw: (props: SvgIconProps) => (
    <AntdIcon
      {...props}
      component={() => (
        <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
          <path
            d="M388.059429 572.928l-147.894858 142.592a55.588571 55.588571 0 0 0-2.706285 77.202286 51.346286 51.346286 0 0 0 74.24 2.194285l221.988571-219.172571-145.627428-2.816z"
            p-id="14065"
          ></path>
          <path
            d="M652.214857 535.076571l-39.131428 39.131429a866.742857 866.742857 0 0 0-51.419429 46.957714l-221.769143 221.769143c-20.882286 20.845714-54.966857 22.820571-86.564571 7.936l-9.581715 9.216c-16.384 16.018286-46.628571 23.442286-70.326857-0.219428-23.661714-23.698286-14.848-55.332571-1.353143-71.497143l9.508572-9.508572c-14.628571-31.451429-12.617143-65.316571 8.155428-86.052571l221.805715-221.805714a866.742857 866.742857 0 0 1 51.419428-46.921143l39.131429-39.131429 150.125714 150.125714z m-84.772571-6.509714l-58.843429-58.843428L256 713.910857a45.348571 45.348571 0 0 0-2.230857 62.902857 41.691429 41.691429 0 0 0 60.269714 1.828572l253.44-250.075429z m278.272-343.515428c43.227429 43.227429 48.64 107.922286 12.068571 144.493714l-93.696 93.696 9.764572 9.801143c27.026286 26.989714 31.414857 66.413714 9.801142 88.064-21.613714 21.577143-61.074286 17.188571-88.064-9.801143l-176.128-176.128c-27.062857-27.026286-31.414857-66.450286-9.801142-88.064s61.074286-17.225143 88.064 9.801143l9.801142 9.764571 93.659429-93.659428c36.571429-36.571429 101.302857-31.195429 144.530286 12.032z"
            p-id="14066"
          ></path>
        </svg>
      )}
    />
  ),
};
