# pinc
pinc (__p__retty __inc__lude) は設定ファイルにもとづいてファイルインクルードを実現するインクルードエンジンです。

設定ファイル pinc.yaml には以下のような記述をします。
```
(id):
  url: path
  template: path
  partial:
    (name1): path
    (name2): path
    (name3): path
    ...
```

例えば、以下のディレクトリ構成の場合を考えます。
```
./
    pinc.yaml
    template/
        default.html
    partial/
        header.html
        footer.html
        main.html
```

pinc.yaml:
```yaml
001:
  url: index.html
  template: default.html
  partial:
    header: header.html
    footer: footer.html
    main: main.html
```

template/default.html:
```html
<!doctype html>
<html lang="ja">
<head>
{{ header }}
</head>
<body>
<div clas="main">
{{ main }}
</div>
{{ footer }}
</body>
</html>
```

partial/header.html:
```html
  <meta charset="utf-8">
```

partial/footer.html
```html
<div>
</div>
```

partial/main.html
```html
hello world.
```

`pinc` コマンドを実行すると、カレントディレクトリにある pinc.yaml に基づいてインクルードが実行されます。
```shell
$ pinc
```


インクルード結果はdestディレクトリに出力されます。  
その際のファイル名およびパスは url で指定したものになります。
```
./
    pinc.yaml
    dest/
        index.html
    template/
        default.html
    partial/
        header.html
        footer.html
        main.html
```

dest/index.htmlの中身は以下のとおりです。partialの各ファイルの内容が展開されています。

```html:dest/index.html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
</head>
<body>
<div clas="main">
hello world.
</div>
<div>
</div>
</body>
</html>
```


pinc はこれを実現するためだけのアプリケーションです。（これから作ります。）