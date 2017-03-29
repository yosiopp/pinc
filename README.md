# pinc
pinc (**p**retty **inc**lude) は設定ファイル( pinc.yaml )にもとづいてファイルインクルードを実現するインクルードエンジンです。

## インストール
```
npm install pinc
```
(※ `pinc` コマンドを利用する為には `npm install -g` でインストールするか node_modules/.bin/ にPATHを通す必要があります)

## 用途

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

それぞれのファイル内容は以下のとおりです。

pinc.yaml:
```yaml
P001:
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

template ファイルに 埋め込み指示コード `{{ IDENTIFIER }}` を記載します。
この時の IDENTIFIER は partial の属性名に対応します。

partial/header.html:
```html
  <meta charset="utf-8">
```

partial/footer.html:
```html
<div>
</div>
```

partial/main.html:
```html
hello world.
```

この状態で `pinc` コマンドを実行すると、カレントディレクトリにある pinc.yaml に基づいてインクルードが実行されます。つまり、partial.headerであるheader.htmlの中身を `{{ header }}` に展開します。  
```shell
$ pinc
P001 -> index.html
```


インクルードされた結果は dest ディレクトリに出力されます。  
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

出力された dest/index.html の中身は以下のとおりです。  
partialの各ファイルの内容が展開されています。

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

pinc はこれを実現するためだけのアプリケーションです。

## pinc.yamlについて

設定ファイル pinc.yaml には以下のような記述をします。
```yaml
(id):
  url: path
  template: path
  partial:
    (key): path
```
※ (id), (key) はそれぞれ任意の文字列

* yamlハッシュのキーとして数値のみを指定することは推奨しません。その場合、意図しない動作をする可能性があります。
* pinc.yaml に記載する id は処理には利用されませんが、yamlハッシュである性質上、ユニークでなければなりません。
* pinc.yaml には yamlに準拠したコメント(#)を含めることができます。
* template に指定したファイルが存在しない場合、エラー(Error)が発生し該当のファイルは作成されません。
* partial に指定したファイルが存在しない場合、警告(Warn)が発生し空ファイルとみなして処理します。
* template および partial に指定するファイルパスにはディレクトリを含めることができます。
* url に指定するファイルパスにはディレクトリを含めることができます。生成時に自動的にディレクトリも作成します。

## その他仕様
* template ディレクトリ、 partial ディレクトリ、および pinc.yaml は `pinc` が動作する上で必須です。これらのディレクトリやファイルの名称を変更/指定することは出来ません（現時点では）
* template ファイルに記載する埋め込み指示コード `{{ IDENTIFIER }}` は空白も含めて厳密でなければなりません。正規表現では `{{ \w+ }}` となります。
