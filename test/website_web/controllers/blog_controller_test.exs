defmodule WebsiteWeb.BlogControllerTest do
  use WebsiteWeb.ConnCase, async: true

  test "should get first blog", %{conn: conn} do
    conn = get(conn, "/blog/hello-world")

    html_response(conn, 200)
    |> assert_html("title", "Shah Syed · Hello World!")
    |> assert_html("a[href='/blog']", count: 2)
    |> assert_html("a[href='/resume']", count: 1)
    |> assert_html("a[href='/projects/bachao']", count: 1)
    |> assert_html("a[href='/projects/portfolio']", count: 1)
    |> assert_html("a[href='/contact']", count: 1)
    |> assert_html("a", min: 2)
    |> assert_html("a", max: 10)
  end

end
