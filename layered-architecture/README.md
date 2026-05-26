# レイヤードアーキテクチャ

アプリケーションを **Presentation / BusinessLogic / DataAccess** の3層に分割し、各層が下の層にのみ依存する構造。

```
Presentation  （BookController）
      ↓
BusinessLogic （BookService）
      ↓
DataAccess    （BookRepository）
```

## 実装例

- [bad/](./bad/) — 密結合な実装（問題あり）
- [good/](./good/) — 疎結合な実装（改善後）

---

## bad: 密結合な実装の問題点

### 構造

```
BookController
      ↓（具体クラスに依存）
BookService
      ↓（具体クラスに依存）
BookRepository
```

### 問題1: 上位層が下位層の具体クラスに直接依存している

各クラスがコンストラクタ内で依存オブジェクトを `new` している。

- [`bad/src/controllers/book.controller.ts`](./bad/src/controllers/book.controller.ts) — `new BookService()` を内部で生成
- [`bad/src/services/book.service.ts`](./bad/src/services/book.service.ts) — `new BookRepository()` を内部で生成

下位層の実装を変更すると（例：Prisma → 別のORM）、上位層のコードにも変更が波及する。

### 問題2: テストが困難

`BookService` の単体テストを書こうとしても、内部で `new BookRepository()` が呼ばれるため、DB接続なしにはテストできない。モックへの差し替えが不可能。

### 関連ファイル

| ファイル | 役割 |
|---------|------|
| [`bad/src/app.ts`](./bad/src/app.ts) | エントリーポイント |
| [`bad/src/routes/book.router.ts`](./bad/src/routes/book.router.ts) | ルーティング |
| [`bad/src/controllers/book.controller.ts`](./bad/src/controllers/book.controller.ts) | コントローラ（内部でServiceをnew） |
| [`bad/src/services/book.service.ts`](./bad/src/services/book.service.ts) | サービス（内部でRepositoryをnew） |
| [`bad/src/repositories/book.repository.ts`](./bad/src/repositories/book.repository.ts) | リポジトリ（Prisma直接利用） |

---

## good: 疎結合な実装（改善後）

### 構造

```
BookController
      ↓（インターフェースに依存）
BookServiceInterface ←← BookService
                               ↓（インターフェースに依存）
                   BookRepositoryInterface ←← BookRepository
```

各上位層はインターフェース（抽象）に依存し、具体クラスは外部から注入される。

### 改善1: インターフェースを定義して抽象に依存させる（DIP）

- [`good/src/services/book.service.interface.ts`](./good/src/services/book.service.interface.ts) — `BookServiceInterface` を定義
- [`good/src/repositories/book.repository.interface.ts`](./good/src/repositories/book.repository.interface.ts) — `BookRepositoryInterface` を定義

`BookController` は `BookServiceInterface` に、`BookService` は `BookRepositoryInterface` に依存するため、実装を差し替えても上位層に影響が出ない。

### 改善2: Dependency Injection で依存を外部から注入する

- [`good/src/controllers/book.controller.ts`](./good/src/controllers/book.controller.ts) — コンストラクタで `BookServiceInterface` を受け取る
- [`good/src/services/book.service.ts`](./good/src/services/book.service.ts) — コンストラクタで `BookRepositoryInterface` を受け取る

依存オブジェクトの生成は `app.ts` に集約されている（Composition Root）。

- [`good/src/app.ts`](./good/src/app.ts) — `new BookRepository()` → `new BookService(repo)` → `new BookController(service)` の順で組み立て

### 関連ファイル

| ファイル | 役割 |
|---------|------|
| [`good/src/app.ts`](./good/src/app.ts) | エントリーポイント（Composition Root） |
| [`good/src/routes/book.router.ts`](./good/src/routes/book.router.ts) | ルーティング |
| [`good/src/controllers/book.controller.ts`](./good/src/controllers/book.controller.ts) | コントローラ（インターフェース経由でDI） |
| [`good/src/services/book.service.interface.ts`](./good/src/services/book.service.interface.ts) | Serviceインターフェース |
| [`good/src/services/book.service.ts`](./good/src/services/book.service.ts) | サービス（インターフェース経由でDI） |
| [`good/src/repositories/book.repository.interface.ts`](./good/src/repositories/book.repository.interface.ts) | Repositoryインターフェース |
| [`good/src/repositories/book.repository.ts`](./good/src/repositories/book.repository.ts) | リポジトリ（Prisma利用、インターフェースを実装） |

---

## bad と good の比較

| 観点 | bad | good |
|------|-----|------|
| 依存先 | 具体クラス | インターフェース（抽象） |
| 依存の生成場所 | 各クラスのコンストラクタ内 | `app.ts`（Composition Root）に集約 |
| インターフェース | なし | `BookServiceInterface` / `BookRepositoryInterface` |
| DIP（依存性逆転） | 違反 | 遵守 |
| DI（依存性注入） | なし | コンストラクタDI |
| テスト容易性 | DBなしにテスト不可 | モックに差し替えてテスト可能 |
| 実装差し替え | 各クラスの修正が必要 | `app.ts` の1行変更のみ |
